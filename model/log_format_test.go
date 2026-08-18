package model

import "testing"

func TestFormatChannelAdminLogsMasksUserInfo(t *testing.T) {
	logs := []*Log{
		{
			UserId:    12,
			Username:  "alice",
			TokenId:   34,
			TokenName: "secret-token",
			Ip:        "1.2.3.4",
			Other:     `{"admin_info":{"user":"alice"},"audit_info":{"op":"x"},"keep":1}`,
		},
	}
	FormatChannelAdminLogs(logs)
	if logs[0].Username != "**" || logs[0].TokenName != "**" {
		t.Fatalf("expected username and token name to be masked, got %q / %q", logs[0].Username, logs[0].TokenName)
	}
	if logs[0].UserId != 0 || logs[0].TokenId != 0 {
		t.Fatalf("expected user and token ids to be cleared, got %d / %d", logs[0].UserId, logs[0].TokenId)
	}
	if logs[0].Ip != "" {
		t.Fatalf("expected ip to be cleared, got %q", logs[0].Ip)
	}
	if logs[0].Other == "" {
		t.Fatal("expected other json to remain")
	}
}
