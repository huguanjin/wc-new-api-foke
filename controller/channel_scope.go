package controller

import (
	"net/http"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/i18n"
	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// channelAccessScope describes how channel list/detail queries are filtered for
// the current caller.
type channelAccessScope struct {
	Role      int
	UserID    int
	UserGroup string
}

func resolveChannelAccessScope(c *gin.Context) channelAccessScope {
	return channelAccessScope{
		Role:      c.GetInt("role"),
		UserID:    c.GetInt("id"),
		UserGroup: c.GetString("group"),
	}
}

func applyChannelAccessScope(query *gorm.DB, scope channelAccessScope) *gorm.DB {
	switch {
	case common.IsFullAdmin(scope.Role):
		return query
	case scope.Role == common.RoleChannelAdmin:
		return query.Where("creator_id = ?", scope.UserID)
	case scope.Role == common.RoleReadonlyAdmin:
		if strings.TrimSpace(scope.UserGroup) == "" {
			return query.Where("1 = 0")
		}
		return model.ApplyChannelGroupFilter(query, scope.UserGroup)
	default:
		// Should not reach here under ChannelStaffAuth; fail closed.
		return query.Where("1 = 0")
	}
}

func channelAccessible(channel *model.Channel, scope channelAccessScope) bool {
	if channel == nil {
		return false
	}
	switch {
	case common.IsFullAdmin(scope.Role):
		return true
	case scope.Role == common.RoleChannelAdmin:
		return channel.CreatorId == scope.UserID
	case scope.Role == common.RoleReadonlyAdmin:
		return channelGroupContains(channel.Group, scope.UserGroup)
	default:
		return false
	}
}

func channelGroupContains(channelGroups string, userGroup string) bool {
	userGroup = strings.TrimSpace(userGroup)
	if userGroup == "" {
		return false
	}
	for _, g := range strings.Split(channelGroups, ",") {
		if strings.TrimSpace(g) == userGroup {
			return true
		}
	}
	return false
}

func abortIfChannelInaccessible(c *gin.Context, channel *model.Channel) bool {
	scope := resolveChannelAccessScope(c)
	if channelAccessible(channel, scope) {
		return false
	}
	c.JSON(http.StatusOK, gin.H{
		"success": false,
		"message": common.TranslateMessage(c, i18n.MsgAuthInsufficientPrivilege),
	})
	return true
}

func abortIfNotFullAdmin(c *gin.Context) bool {
	if common.IsFullAdmin(c.GetInt("role")) {
		return false
	}
	common.ApiErrorI18n(c, i18n.MsgAuthInsufficientPrivilege)
	return true
}

// applyChannelAdminCreateDefaults forces routing defaults for channel admins.
func applyChannelAdminCreateDefaults(channel *model.Channel, creatorID int) {
	zeroPriority := int64(0)
	zeroWeight := uint(0)
	channel.CreatorId = creatorID
	channel.Group = "default"
	channel.Priority = &zeroPriority
	channel.Weight = &zeroWeight
	channel.Status = common.ChannelStatusManuallyDisabled
}

// stripChannelAdminRestrictedFields prevents channel admins from changing
// routing/status fields on update.
func stripChannelAdminRestrictedFields(channel *PatchChannel, origin *model.Channel, requestData map[string]any) {
	delete(requestData, "priority")
	delete(requestData, "weight")
	delete(requestData, "group")
	delete(requestData, "status")
	channel.Priority = origin.Priority
	channel.Weight = origin.Weight
	channel.Group = origin.Group
	channel.Status = origin.Status
}
