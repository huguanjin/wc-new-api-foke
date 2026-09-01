package common

import "testing"

func TestIsValidateRoleIncludesChannelStaff(t *testing.T) {
	valid := []int{RoleGuestUser, RoleCommonUser, RoleChannelAdmin, RoleReadonlyAdmin, RoleAdminUser, RoleRootUser}
	for _, role := range valid {
		if !IsValidateRole(role) {
			t.Fatalf("expected role %d to be valid", role)
		}
	}
	if IsValidateRole(2) || IsValidateRole(9) || IsValidateRole(50) {
		t.Fatal("unexpected role accepted as valid")
	}
}

func TestIsChannelStaffAndFullAdmin(t *testing.T) {
	if IsChannelStaff(RoleCommonUser) {
		t.Fatal("common user should not be channel staff")
	}
	if !IsChannelStaff(RoleChannelAdmin) || !IsChannelStaff(RoleReadonlyAdmin) || !IsChannelStaff(RoleAdminUser) {
		t.Fatal("channel staff roles should include channel admin, readonly admin, and full admin")
	}
	if IsFullAdmin(RoleChannelAdmin) || IsFullAdmin(RoleReadonlyAdmin) {
		t.Fatal("channel staff should not be treated as full admin")
	}
	if !IsFullAdmin(RoleAdminUser) || !IsFullAdmin(RoleRootUser) {
		t.Fatal("admin and root should be full admin")
	}
}
