// Package lumen — vendored Lumen v0.13 token subset for Go consumers.
//
// In production, this package would be generated from dist/json/tokens.json
// at build time. The reference inlines the subset the three surfaces need.
package lumen

import (
	"strings"

	"github.com/charmbracelet/lipgloss"
)

// Color tokens — adaptive (Light/Dark) where the terminal background is
// auto-detected by lipgloss. CompleteColor falls back from Truecolor → 256 → 16
// → 8 as terminal capability degrades.
var (
	SurfaceCanvas = lipgloss.AdaptiveColor{
		Light: "#FAFAFA", // paper anchor
		Dark:  "#0D0D0D", // obsidian
	}
	SurfaceRaised = lipgloss.AdaptiveColor{
		Light: "#F1F1F1",
		Dark:  "#171717",
	}
	SurfaceSunken = lipgloss.AdaptiveColor{
		Light: "#E8E8E8",
		Dark:  "#0A0A0A",
	}
	TextPrimary = lipgloss.AdaptiveColor{
		Light: "#0D0D0D",
		Dark:  "#FAFAFA",
	}
	TextSecondary = lipgloss.AdaptiveColor{
		Light: "#404040",
		Dark:  "#A6A6A6",
	}
	TextTertiary = lipgloss.AdaptiveColor{
		Light: "#737373",
		Dark:  "#737373",
	}
	AccentSpring = lipgloss.CompleteColor{
		TrueColor: "#00FA8A",
		ANSI256:   "120",
		ANSI:      "10",
	}
	PrimaryFg = lipgloss.Color("#07120D") // hard rule 9
	BorderDefault = lipgloss.AdaptiveColor{
		Light: "#D1D1D1",
		Dark:  "#2E2E2E",
	}
	StatusWarning = lipgloss.CompleteColor{
		TrueColor: "#FBC11C",
		ANSI256:   "220",
		ANSI:      "11",
	}
	StatusDanger = lipgloss.CompleteColor{
		TrueColor: "#FF4D4D",
		ANSI256:   "203",
		ANSI:      "9",
	}
)

// Style primitives — composed once, reused everywhere.
var (
	// Primary button surface — hard rule 9 (PrimaryFg on AccentSpring, never white)
	PrimaryBadge = lipgloss.NewStyle().
			Bold(true).
			Foreground(PrimaryFg).
			Background(AccentSpring).
			Padding(0, 2)

	// Card surface — rounded border + raised surface
	Card = lipgloss.NewStyle().
		Background(SurfaceRaised).
		Foreground(TextPrimary).
		Border(lipgloss.RoundedBorder()).
		BorderForeground(BorderDefault).
		Padding(1, 2)

	// .lumen-label — uppercase + bold + spaced characters for tracking
	LumenLabel = lipgloss.NewStyle().
			Bold(true).
			Foreground(TextTertiary).
			Transform(func(s string) string {
			return strings.Join(strings.Split(strings.ToUpper(s), ""), " ")
		})

	// .lumen-mono — terminal fonts are already mono; tnum/lnum implicit
	LumenMono = lipgloss.NewStyle().Foreground(TextPrimary)
)
