import requests
import json

def run_e2e_verification():
    print("--- 1. Testing Frontend Static Server (Port 3000) ---")
    fe_res = requests.get("http://localhost:3000")
    print(f"Frontend Status: {fe_res.status_code} | Content length: {len(fe_res.text)}")
    assert fe_res.status_code == 200, "Frontend server failed"
    assert '<div id="root">' in fe_res.text, "index.html root missing"
    print(" Frontend serving SPA index.html cleanly")

    print("\n--- 2. Testing Master Admin Authentication (Port 5000) ---")
    login_res = requests.post("http://127.0.0.1:5000/api/auth/login", json={
        "email": "admin@nutrigen.ai",
        "password": "Admin@123456"
    })
    print(f"Admin Login Status: {login_res.status_code}")
    assert login_res.status_code == 200, f"Admin login failed: {login_res.text}"
    login_data = login_res.json()
    token = login_data.get("token")
    user = login_data.get("user")
    print(f" Authenticated as: {user.get('displayName')} | Role: {user.get('accountType')} | Tier: {user.get('subscriptionTier')}")
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    print("\n--- 3. Testing Executive Overview Telemetry ---")
    overview_res = requests.get("http://127.0.0.1:5000/api/admin/overview", headers=headers)
    print(f"Overview Status: {overview_res.status_code}")
    assert overview_res.status_code == 200
    overview = overview_res.json()["overview"]
    print(f" Total Registered Accounts: {overview['totalUsers']}")
    print(f" 2x2 Matrix Breakdown: {overview['breakdown']}")
    print(f" System Telemetry: {overview['telemetry']}")

    print("\n--- 4. Testing Global Users CRUD & Matrix Management ---")
    create_res = requests.post("http://127.0.0.1:5000/api/admin/users/create", json={
        "displayName": "Dr. Marcus Vance",
        "email": "marcus.vance@metabolic-clinic.org",
        "accountType": "professional",
        "professionalRole": "Chief Bariatric Nutritionist (M.D.)",
        "organizationName": "Metabolic Wellness Center",
        "licenseId": "NPI-99882211"
    }, headers=headers)
    print(f"User Creation Status: {create_res.status_code}")
    assert create_res.status_code in [200, 201]
    created_u = create_res.json()["user"]
    uid = created_u["uid"]
    print(f" Created Practitioner: {created_u['displayName']} (Code: {created_u['clinicalInviteCode']})")

    # Update user to Pro tier and verify
    update_res = requests.post(f"http://127.0.0.1:5000/api/admin/users/{uid}/update", json={
        "subscriptionTier": "pro",
        "resetQuotas": True
    }, headers=headers)
    print(f"User Update Status: {update_res.status_code}")
    assert update_res.status_code == 200
    print(f" Account upgraded to NutriGen Pro")

    # Query practitioners list
    practitioners_res = requests.get("http://127.0.0.1:5000/api/admin/practitioners", headers=headers)
    print(f"Practitioners List Status: {practitioners_res.status_code} | Total Practitioners: {practitioners_res.json()['count']}")
    assert practitioners_res.status_code == 200

    # Toggle verification status
    verify_res = requests.post(f"http://127.0.0.1:5000/api/admin/practitioners/{uid}/verify", json={"verified": True}, headers=headers)
    print(f"Accreditation Toggle Status: {verify_res.status_code} | Verified: {verify_res.json()['credentialVerified']}")
    assert verify_res.status_code == 200

    # Update Feature Flags Switchboard
    feature_res = requests.post("http://127.0.0.1:5000/api/admin/features/update", json={
        "aiVisionPlateScanner": True,
        "gpt4oCoachEngine": True,
        "wearablesLiveSync": True,
        "cgmSyncIntegration": True,
        "usdaLiveFoodDb": True,
        "baseQuotaAiScans": 5,
        "baseQuotaAiCoach": 10
    }, headers=headers)
    print(f"Feature Flags Update Status: {feature_res.status_code}")
    assert feature_res.status_code == 200
    print(" Real-time Feature Flags synchronized across global cluster")

    # Audit log feed
    audit_res = requests.get("http://127.0.0.1:5000/api/admin/audit-logs", headers=headers)
    print(f"Audit Logs Status: {audit_res.status_code} | Total Log Entries: {audit_res.json()['count']}")
    assert audit_res.status_code == 200
    latest_log = audit_res.json()["auditLogs"][0]
    print(f" Live Security Action: [{latest_log['timestamp']}] {latest_log['action']} -> {latest_log['details']}")

    # Cleanup
    del_res = requests.post(f"http://127.0.0.1:5000/api/admin/users/{uid}/delete", headers=headers)
    print(f"Cleanup Delete Status: {del_res.status_code}")
    assert del_res.status_code == 200
    print(" Test user cleaned up successfully")

    # Reset default feature flags
    requests.post("http://127.0.0.1:5000/api/admin/features/update", json={
        "aiVisionPlateScanner": True,
        "gpt4oCoachEngine": True,
        "wearablesLiveSync": True,
        "cgmSyncIntegration": True,
        "usdaLiveFoodDb": True,
        "baseQuotaAiScans": 3,
        "baseQuotaAiCoach": 5
    }, headers=headers)

    print("\n=========================================================")
    print(" ALL ADMIN SYSTEM & END-TO-END VERIFICATION CHECKS PASSED!")
    print("=========================================================\n")

if __name__ == '__main__':
    run_e2e_verification()
