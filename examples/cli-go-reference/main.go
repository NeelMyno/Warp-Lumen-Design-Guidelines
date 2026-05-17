// warp-quote — Lumen v0.13 CLI reference. A `warp quote --interactive` mock
// rendered with Charm's Lipgloss + Bubbletea. Three surfaces: stat, primary
// button, card.
//
// Demonstrates the CLI contract from design-system/04-platforms/cli.md:
//   - lipgloss.AdaptiveColor + CompleteColor for terminal-capability fallback
//   - Hard rule 9 honored via PrimaryFg (#07120D) on AccentSpring
//   - NO_COLOR honored — lipgloss respects the env var automatically
//   - !stdout.isTTY → no animation, emit final state only

package main

import (
	"fmt"
	"os"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"

	"github.com/NeelMyno/Warp-Lumen-Design-Guidelines/examples/cli-go-reference/lumen"
)

// ============================================================================
// Surface 1: Stat — the Lumen signature
// ============================================================================
func renderStat(value, label, unit string) string {
	valueStyle := lipgloss.NewStyle().Bold(true).Foreground(lumen.TextPrimary)
	unitStyle := lipgloss.NewStyle().Foreground(lumen.TextTertiary)

	line1 := lipgloss.JoinHorizontal(
		lipgloss.Bottom,
		valueStyle.Render(value),
		" ",
		unitStyle.Render(unit),
	)
	line2 := lumen.LumenLabel.Render(label)
	return lipgloss.JoinVertical(lipgloss.Left, line1, line2)
}

// ============================================================================
// Surface 2: Primary button — hard rule 9
// ============================================================================
func renderPrimaryButton(label string) string {
	return lumen.PrimaryBadge.Render(" " + label + "   →")
}

// ============================================================================
// Surface 3: Card — composed surface
// ============================================================================
func renderQuoteCard(from, to string, pallets int, rate string, carrier string, otd string) string {
	header := lumen.LumenLabel.Render(fmt.Sprintf("Quote · %s→%s · %d pallets", from, to, pallets))
	body := lipgloss.JoinVertical(
		lipgloss.Left,
		renderStat(rate, "Rate per pallet", ""),
		"",
		lipgloss.NewStyle().Foreground(lumen.TextSecondary).Render(carrier+" · "+otd+" OTD"),
		"",
		renderPrimaryButton("BOOK SHIPMENT"),
	)
	return lumen.Card.Width(48).Render(
		lipgloss.JoinVertical(lipgloss.Left, header, "", body),
	)
}

// ============================================================================
// Bubbletea model — interactive walkthrough of the three surfaces
// ============================================================================
type model struct {
	step      int
	finished  bool
}

func initialModel() model {
	return model{step: 0}
}

func (m model) Init() tea.Cmd {
	return nil
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c", "q":
			return m, tea.Quit
		case "enter", " ":
			m.step++
			if m.step >= 4 {
				m.finished = true
				return m, tea.Quit
			}
		}
	}
	return m, nil
}

func (m model) View() string {
	if m.finished {
		return lumen.LumenLabel.Render("Done.") + "\n"
	}

	header := lumen.LumenLabel.Render("L U M E N   v 0 . 1 3   ·   C L I   ·   G O")

	var body string
	switch m.step {
	case 0:
		body = renderQuoteCard("LAX", "SFO", 12, "$2,840", "Estes", "98.2%")
	case 1:
		body = lipgloss.JoinVertical(
			lipgloss.Left,
			renderStat("98.2%", "On-Time Delivery", ""),
			"",
			renderStat("$0.42", "Per Pallet Average", "/lb"),
			"",
			renderStat("12", "Pallets", ""),
		)
	case 2:
		body = lipgloss.JoinHorizontal(
			lipgloss.Top,
			renderPrimaryButton("BOOK"),
			"  ",
			lipgloss.NewStyle().Foreground(lumen.TextSecondary).Render("·"),
			"  ",
			lipgloss.NewStyle().Foreground(lumen.AccentSpring).Bold(true).Render("● LIVE"),
		)
	default:
		body = lumen.LumenLabel.Render("Press ENTER to continue.")
	}

	footer := lipgloss.NewStyle().Foreground(lumen.TextTertiary).Render(
		"\n[ENTER] next  [q] quit",
	)

	return lipgloss.JoinVertical(
		lipgloss.Left,
		header,
		"",
		body,
		footer,
	)
}

func main() {
	// !stdout.isTTY → emit final state, no Bubbletea loop. Pipe-friendly.
	if !isTTY() {
		fmt.Println(renderQuoteCard("LAX", "SFO", 12, "$2,840", "Estes", "98.2%"))
		return
	}

	p := tea.NewProgram(initialModel())
	if _, err := p.Run(); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}

// isTTY reports whether stdout is connected to a terminal.
func isTTY() bool {
	stat, err := os.Stdout.Stat()
	if err != nil {
		return false
	}
	return (stat.Mode() & os.ModeCharDevice) != 0
}
