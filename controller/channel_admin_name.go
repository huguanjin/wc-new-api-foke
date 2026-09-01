package controller

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

var channelAdminResourceOptions = map[string]struct{}{
	"official":   {},
	"awsp":       {},
	"awsb":       {},
	"azure":      {},
	"openrouter": {},
	"gcp":        {},
	"vertexai":   {},
	"maas":       {},
	"ccmax":      {},
	"codex":      {},
	"gcppt":      {},
	"tengxun":    {},
	"cloudfare":  {},
	"byteplus":   {},
	"vercel":     {},
}

var channelAdminModelSeriesOptions = map[string]struct{}{
	"gemini":      {},
	"gpt":         {},
	"gptimage":    {},
	"claude":      {},
	"geminiimage": {},
	"minimax":     {},
	"kimi":        {},
	"deepseek":    {},
	"glm":         {},
	"grok":        {},
	"seedream":    {},
	"seed":        {},
	"seedance":    {},
	"qwen":        {},
	"veo":         {},
}

var channelAdminLifecycleOptions = map[string]struct{}{
	"速刷": {},
	"长效": {},
}

var channelAdminRatePattern = regexp.MustCompile(`^[0-9]+(\.[0-9]+)?$`)

func validateChannelAdminName(name string, username string) error {
	trimmedName := strings.TrimSpace(name)
	trimmedUsername := strings.TrimSpace(username)
	if trimmedUsername == "" {
		return fmt.Errorf("渠道管理员用户名不能为空")
	}
	if trimmedName == "" {
		return fmt.Errorf("渠道管理员渠道名称格式无效，应为：用户名-资源构成-模型系列-生命周期-倍率")
	}

	prefix := trimmedUsername + "-"
	if !strings.HasPrefix(trimmedName, prefix) {
		return fmt.Errorf("渠道名称必须以当前用户名 %s 开头", trimmedUsername)
	}

	rest := strings.TrimPrefix(trimmedName, prefix)
	parts := strings.Split(rest, "-")
	if len(parts) != 4 {
		return fmt.Errorf("渠道管理员渠道名称格式无效，应为：用户名-资源构成-模型系列-生命周期-倍率")
	}

	resource, series, lifecycle, rate := parts[0], parts[1], parts[2], parts[3]
	if _, ok := channelAdminResourceOptions[resource]; !ok {
		return fmt.Errorf("资源构成无效")
	}
	if _, ok := channelAdminModelSeriesOptions[series]; !ok {
		return fmt.Errorf("模型系列无效")
	}
	if _, ok := channelAdminLifecycleOptions[lifecycle]; !ok {
		return fmt.Errorf("生命周期必须是速刷或长效")
	}
	if !channelAdminRatePattern.MatchString(rate) {
		return fmt.Errorf("倍率必须是数字")
	}
	if _, err := strconv.ParseFloat(rate, 64); err != nil {
		return fmt.Errorf("倍率必须是数字")
	}
	return nil
}
