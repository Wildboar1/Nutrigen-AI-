import urllib.request
import json
import uuid
import sys
import io

# Force utf-8 stdout on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_URL = 'http://127.0.0.1:5000/api'

def req(endpoint, method='GET', data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f"Bearer {token}"
        headers['X-User-Email'] = token
    
    body = json.dumps(data).encode('utf-8') if data else None
    request = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request) as response:
            res_body = response.read().decode('utf-8')
            return response.getcode(), json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        return e.code, json.loads(err_body) if err_body else {'error': str(e)}

def run_tests():
    print("=== NutriGen AI 2x2 Matrix & Practitioner Integration Verification ===")
    
    # 1. Register Professional Practitioner
    prof_email = f"dr.sarah.{uuid.uuid4().hex[:6]}@mayo.clinic"
    code, res = req('/auth/register', 'POST', {
        'email': prof_email,
        'password': 'Password123!',
        'displayName': 'Dr. Sarah Jenkins, M.D.',
        'accountType': 'professional',
        'professionalRole': 'Clinical Nutritionist & Metabolic Specialist (M.D.)',
        'organizationName': 'Mayo Metabolic Health Clinic',
        'licenseId': 'MD-849201'
    })
    assert code == 201, f"Failed prof register: {res}"
    prof_token = res['token']
    prof_user = res['user']
    clinical_code = prof_user.get('clinicalInviteCode')
    print(f"✅ 1. Registered Practitioner: {prof_user['displayName']} | Invite Code: {clinical_code}")
    assert clinical_code and clinical_code.startswith('CLIN-'), f"Invalid clinical code: {clinical_code}"

    # 2. Look up Clinical Code
    code, res = req('/practitioner/lookup-code', 'POST', {'code': clinical_code})
    assert code == 200 and res.get('found'), f"Code lookup failed: {res}"
    practitioner_meta = res['practitioner']
    print(f"✅ 2. Code Lookup Verified: Found '{practitioner_meta['name']}' at '{practitioner_meta['organization']}'")

    # 3. Register Solo Individual Patient (Base plan by default)
    patient_email = f"patient.alex.{uuid.uuid4().hex[:6]}@gmail.com"
    code, res = req('/auth/register', 'POST', {
        'email': patient_email,
        'password': 'Password123!',
        'displayName': 'Alex Rivera',
        'accountType': 'individual'
    })
    assert code == 201, f"Failed patient register: {res}"
    patient_token = res['token']
    patient_user = res['user']
    assert patient_user['accountMode'] == 'solo', "Default accountMode must be solo"
    assert patient_user['subscriptionTier'] == 'base', "Default subscriptionTier must be base"
    print(f"✅ 3. Registered Solo Patient: {patient_user['displayName']} | Mode: {patient_user['accountMode']} | Tier: {patient_user['subscriptionTier']}")

    # 4. Enforce Quotas on Base Plan
    # Consume 3 AI scans
    for i in range(3):
        code, res = req('/subscription/consume-quota', 'POST', {'quotaType': 'aiScans'}, patient_token)
        assert code == 200 and res['allowed'], f"AI scan #{i+1} should be allowed on Base: {res}"
    print("✅ 4a. Consumed 3 free AI plate scans on Base Plan")

    # 4th scan should exceed quota
    code, res = req('/subscription/consume-quota', 'POST', {'quotaType': 'aiScans'}, patient_token)
    assert code == 403 and not res.get('allowed'), "4th AI scan should be rejected on Base plan"
    print("✅ 4b. Base quota enforcement verified (4th scan successfully blocked with upgrade requirement)")

    # 5. Connect Patient to Practitioner via Invite Code
    code, res = req('/patient/connect-practitioner', 'POST', {'code': clinical_code}, patient_token)
    assert code == 200 and res.get('success'), f"Connect failed: {res}"
    linked_patient = res['user']
    assert linked_patient['accountMode'] == 'practitioner_linked', "Account mode should now be practitioner_linked"
    assert linked_patient['practitionerInfo']['id'] == prof_user['uid'], "Practitioner ID mismatch"
    assert linked_patient['subscriptionTier'] == 'base', "Subscription tier should remain unchanged (Base)"
    print(f"✅ 5. Connected to Practitioner: Mode is now '{linked_patient['accountMode']}' | Guided by '{linked_patient['practitionerInfo']['name']}'")

    # 6. Practitioner views Patient Roster
    code, res = req('/practitioner/patients', 'GET', token=prof_token)
    assert code == 200, f"Failed to get patients: {res}"
    patients = res.get('patients', [])
    matched = next((p for p in patients if p['email'] == patient_email), None)
    assert matched is not None, f"Patient {patient_email} not found in practitioner roster: {patients}"
    print(f"✅ 6. Practitioner Roster Verified: {len(patients)} patient(s) in roster, including '{matched['name']}' ({matched['subscriptionTier']} tier)")

    # 7. Practitioner Adjusts Patient Targets & Directives
    code, res = req(f"/practitioner/patient/{linked_patient['uid']}/update-targets", 'POST', {
        'calorieGoal': 2350,
        'proteinGoal': 165,
        'carbsGoal': 210,
        'fatGoal': 70,
        'practitionerNotes': 'Prescribed high-leucine protein protocol with post-workout fueling within 45 mins.'
    }, prof_token)
    assert code == 200 and res.get('success'), f"Update targets failed: {res}"
    print("✅ 7. Practitioner Prescribed Macro Targets & Clinical Directives Saved")

    # 8. Patient verifies updated targets on their dashboard
    code, res = req('/auth/me', 'GET', token=patient_token)
    assert code == 200, f"Failed to get patient me: {res}"
    current_patient = res['user']
    custom_targets = current_patient['practitionerInfo'].get('customTargets', {})
    assert custom_targets.get('calorieGoal') == 2350, f"Calorie goal target mismatch: {custom_targets}"
    assert custom_targets.get('proteinGoal') == 165, f"Protein goal target mismatch: {custom_targets}"
    assert 'high-leucine' in custom_targets.get('practitionerNotes', ''), "Clinical notes mismatch"
    print(f"✅ 8. Patient Dashboard Directive Verified: {custom_targets['calorieGoal']} kcal · {custom_targets['proteinGoal']}g Protein | Notes: '{custom_targets['practitionerNotes']}'")

    # 9. Upgrade to Pro Tier (Practitioner-Linked + Pro combination)
    code, res = req('/subscription/upgrade', 'POST', {'tier': 'pro'}, patient_token)
    assert code == 200 and res.get('success'), f"Upgrade failed: {res}"
    pro_patient = res['user']
    assert pro_patient['subscriptionTier'] == 'pro', "Subscription tier must be pro"
    assert pro_patient['accountMode'] == 'practitioner_linked', "Account mode must remain practitioner_linked"
    print(f"✅ 9. Upgraded to Pro: User is now '{pro_patient['accountMode']}' + '{pro_patient['subscriptionTier']}'")

    # 10. Verify Unlimited Quotas on Pro
    code, res = req('/subscription/consume-quota', 'POST', {'quotaType': 'aiScans'}, patient_token)
    assert code == 200 and res.get('allowed'), "Pro user should have unlimited quota access"
    print("✅ 10. Unlimited Pro AI Access Verified")

    # 11. Disconnect Practitioner (Revert back to Solo + Pro without losing data)
    code, res = req('/patient/disconnect-practitioner', 'POST', token=patient_token)
    assert code == 200 and res.get('success'), f"Disconnect failed: {res}"
    reverted_patient = res['user']
    assert reverted_patient['accountMode'] == 'solo', "Account mode should revert to solo"
    assert reverted_patient['subscriptionTier'] == 'pro', "Subscription tier should remain Pro"
    print(f"✅ 11. Disconnected Practitioner: Mode reverted to '{reverted_patient['accountMode']}' while maintaining '{reverted_patient['subscriptionTier']}' subscription!")

    print("\n🎉 ALL 11 TESTS PASSED! 2x2 Matrix, Clinical Invite Codes, Dynamic Prescriptions & Quotas are 100% OPERATIONAL.")

if __name__ == '__main__':
    run_tests()
