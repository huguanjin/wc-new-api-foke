package controller

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestValidateChannelAdminName(t *testing.T) {
	assert.NoError(t, validateChannelAdminName("wangchuanyun-official-gpt-速刷-0.85", "wangchuanyun"))
	assert.NoError(t, validateChannelAdminName("wangchuanyun-cloudfare-geminiimage-长效-1", "wangchuanyun"))
	assert.Error(t, validateChannelAdminName("other-official-gpt-速刷-0.85", "wangchuanyun"))
	assert.Error(t, validateChannelAdminName("wangchuanyun-unknown-gpt-速刷-0.85", "wangchuanyun"))
	assert.Error(t, validateChannelAdminName("wangchuanyun-official-gpt-速刷-abc", "wangchuanyun"))
	assert.Error(t, validateChannelAdminName("wangchuanyun-official-gpt-临时-0.85", "wangchuanyun"))
	assert.NoError(t, validateChannelAdminName("wang-chuan-official-gpt-速刷-0.85", "wang-chuan"))
	assert.Error(t, validateChannelAdminName("wangchuanyun-official-gpt-速刷--0.85", "wangchuanyun"))
