package authz

const (
	ResourceChannel = "channel"

	ActionRead           = "read"
	ActionOperate        = "operate"
	ActionWrite          = "write"
	ActionCreate         = "create"
	ActionTest           = "test"
	ActionSensitiveWrite = "sensitive_write"
	ActionSecretView     = "secret_view"
)

var (
	ChannelRead           = Permission{Resource: ResourceChannel, Action: ActionRead}
	ChannelOperate        = Permission{Resource: ResourceChannel, Action: ActionOperate}
	ChannelWrite          = Permission{Resource: ResourceChannel, Action: ActionWrite}
	ChannelCreate         = Permission{Resource: ResourceChannel, Action: ActionCreate}
	ChannelTest           = Permission{Resource: ResourceChannel, Action: ActionTest}
	ChannelSensitiveWrite = Permission{Resource: ResourceChannel, Action: ActionSensitiveWrite}
	ChannelSecretView     = Permission{Resource: ResourceChannel, Action: ActionSecretView}
)

func init() {
	RegisterResource(ResourceDefinition{
		Resource: ResourceChannel,
		LabelKey: "Channel Management",
		Actions: []ActionDefinition{
			{
				Action:         ActionRead,
				LabelKey:       "Read channels",
				DescriptionKey: "View channel lists and details without secrets.",
				DefaultRoles:   []string{BuiltInRoleAdmin, BuiltInRoleChannelAdmin, BuiltInRoleReadonlyAdmin},
			},
			{
				Action:         ActionOperate,
				LabelKey:       "Operate channels",
				DescriptionKey: "Enable/disable channels, refresh balances, and manage tagged channel operations.",
				DefaultRoles:   []string{BuiltInRoleAdmin},
			},
			{
				Action:         ActionTest,
				LabelKey:       "Test channel connectivity",
				DescriptionKey: "Run channel connectivity tests.",
				DefaultRoles:   []string{BuiltInRoleAdmin, BuiltInRoleChannelAdmin},
			},
			{
				Action:         ActionWrite,
				LabelKey:       "Edit channel routing",
				DescriptionKey: "Edit non-sensitive settings such as models, groups, and routing rules.",
				DefaultRoles:   []string{BuiltInRoleAdmin},
			},
			{
				Action:         ActionCreate,
				LabelKey:       "Create channels",
				DescriptionKey: "Create new channels.",
				DefaultRoles:   []string{BuiltInRoleChannelAdmin},
			},
			{
				Action:         ActionSensitiveWrite,
				LabelKey:       "Edit sensitive channel settings",
				DescriptionKey: "Delete channels or edit keys, base URLs, and overrides.",
			},
			{
				Action:         ActionSecretView,
				LabelKey:       "View channel secrets",
				DescriptionKey: "Reserved for viewing complete channel keys after secure verification.",
			},
		},
	})
}
