package controller

import (
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/stretchr/testify/assert"
)

func TestChannelAccessibleByRole(t *testing.T) {
	owned := &model.Channel{Id: 1, CreatorId: 7, Group: "default"}
	other := &model.Channel{Id: 2, CreatorId: 8, Group: "vip"}
	multi := &model.Channel{Id: 3, CreatorId: 9, Group: "default,vip"}

	assert.True(t, channelAccessible(owned, channelAccessScope{Role: common.RoleAdminUser, UserID: 1}))
	assert.True(t, channelAccessible(owned, channelAccessScope{Role: common.RoleChannelAdmin, UserID: 7}))
	assert.False(t, channelAccessible(other, channelAccessScope{Role: common.RoleChannelAdmin, UserID: 7}))
	assert.True(t, channelAccessible(owned, channelAccessScope{Role: common.RoleReadonlyAdmin, UserGroup: "default"}))
	assert.False(t, channelAccessible(other, channelAccessScope{Role: common.RoleReadonlyAdmin, UserGroup: "default"}))
	assert.True(t, channelAccessible(multi, channelAccessScope{Role: common.RoleReadonlyAdmin, UserGroup: "vip"}))
	assert.False(t, channelAccessible(owned, channelAccessScope{Role: common.RoleCommonUser, UserID: 7}))
}

func TestApplyChannelAdminCreateDefaults(t *testing.T) {
	priority := int64(9)
	weight := uint(4)
	channel := &model.Channel{
		Group:    "vip",
		Priority: &priority,
		Weight:   &weight,
		Status:   common.ChannelStatusEnabled,
	}
	applyChannelAdminCreateDefaults(channel, 42)
	assert.Equal(t, 42, channel.CreatorId)
	assert.Equal(t, "default", channel.Group)
	assert.Equal(t, int64(0), *channel.Priority)
	assert.Equal(t, uint(0), *channel.Weight)
	assert.Equal(t, common.ChannelStatusManuallyDisabled, channel.Status)
}
