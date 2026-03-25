package auth

import "testing"

func TestParseRequestedRoleAcceptsClient(t *testing.T) {
	role, err := parseRequestedRole("client")
	if err != nil {
		t.Fatalf("expected client role to parse, got error: %v", err)
	}
	if role != PrimaryRoleClient {
		t.Fatalf("expected %q, got %q", PrimaryRoleClient, role)
	}
}

func TestParseRequestedRoleAcceptsExpert(t *testing.T) {
	role, err := parseRequestedRole("expert")
	if err != nil {
		t.Fatalf("expected expert role to parse, got error: %v", err)
	}
	if role != PrimaryRoleExpert {
		t.Fatalf("expected %q, got %q", PrimaryRoleExpert, role)
	}
}

func TestParseRequestedRoleRejectsAdmin(t *testing.T) {
	if _, err := parseRequestedRole("admin"); err == nil {
		t.Fatal("expected admin role to be rejected for public registration")
	}
}
