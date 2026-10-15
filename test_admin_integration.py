import os
import sys

# Add src and backend/api to sys.path
root_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(root_dir, 'src'))
sys.path.insert(0, os.path.join(root_dir, 'src', 'backend', 'api'))

from app import app, USERS_DB, FEATURE_FLAGS, AUDIT_LOGS

def run_direct_tests():
    print("=== Testing Flask app with Test Client ===")
    client = app.test_client()

    # 1. Overview
    res = client.get('/api/admin/overview')
    print(f"1. GET /api/admin/overview: Status {res.status_code}")
    assert res.status_code == 200, f"Error: {res.data}"
    data = res.get_json()
    assert 'overview' in data
    print(f"   Total Users: {data['overview']['totalUsers']}")
    print(f"   Breakdown: {data['overview']['breakdown']}")

    # 2. Users list
    res = client.get('/api/admin/users?role=all&tier=all&mode=all')
    print(f"2. GET /api/admin/users: Status {res.status_code}")
    assert res.status_code == 200
    users_data = res.get_json()
    print(f"   Found {users_data.get('count')} users")

    # 3. Create user
    res = client.post('/api/admin/users/create', json={
        "name": "Integration Test Subject",
        "email": "test_qa_subject@nutrigen.ai",
        "role": "individual",
        "accountMode": "solo",
        "subscriptionTier": "pro"
    })
    print(f"3. POST /api/admin/users/create: Status {res.status_code}")
    assert res.status_code in [200, 201]
    created = res.get_json().get('user')
    user_id = created['uid']

    # 4. Update user
    res = client.post(f'/api/admin/users/{user_id}/update', json={
        "accountMode": "practitioner_linked",
        "subscriptionTier": "base",
        "resetQuotas": True
    })
    print(f"4. POST /api/admin/users/{user_id}/update: Status {res.status_code}")
    assert res.status_code == 200

    # 5. Practitioners list
    res = client.get('/api/admin/practitioners')
    print(f"5. GET /api/admin/practitioners: Status {res.status_code}")
    assert res.status_code == 200

    # 6. Feature flags
    res = client.get('/api/admin/features')
    print(f"6. GET /api/admin/features: Status {res.status_code}")
    assert res.status_code == 200
    
    res = client.post('/api/admin/features/update', json={
        "aiVisionPlateScanner": True,
        "cgmSyncIntegration": True
    })
    print(f"7. POST /api/admin/features/update: Status {res.status_code}")
    assert res.status_code == 200

    # 8. Audit logs
    res = client.get('/api/admin/audit-logs')
    print(f"8. GET /api/admin/audit-logs: Status {res.status_code}")
    assert res.status_code == 200
    logs = res.get_json().get('auditLogs', [])
    print(f"   Found {len(logs)} audit logs in security feed")

    # 9. Delete user
    res = client.post(f'/api/admin/users/{user_id}/delete')
    print(f"9. POST /api/admin/users/{user_id}/delete: Status {res.status_code}")
    assert res.status_code == 200

    print("\n ALL ADMIN UNIT & INTEGRATION TESTS PASSED SUCCESSFULLY!\n")

if __name__ == '__main__':
    run_direct_tests()
