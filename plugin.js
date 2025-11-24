penpot.ui.open("Signal Widget Generator", "index.html", {
  width: 400,
  height: 200
});

async function generateWidgets(signalList) {
  const board = await penpot.createArtboard({
    name: "Auto Generated Dashboard",
    x: 0,
    y: 0,
    width: 1200,
    height: 800
  });

  const created = [];

  for (const signal of signalList) {
    let widget;

    // ================================
    //       SWITCH TYPE CUSTOM
    // ================================
    switch (signal.type) {
      case "teplota":   // Temperature
        widget = await penpot.createShape("rect", {
          x: signal.initialX,
          y: signal.initialY,
          width: 140,
          height: 50,
          fills: [{ color: "#FFE1C4" }],
          name: `.teplota#${signal.id}`
        });

        await penpot.createShape("text", {
          x: signal.initialX + 10,
          y: signal.initialY + 12,
          text: signal.label || "Teplota",
          fontSize: 14,
          fontFamily: "Work Sans"
        });
        break;

      case "kumulativ":  // Cumulative
        widget = await penpot.createShape("rect", {
          x: signal.initialX,
          y: signal.initialY,
          width: 160,
          height: 60,
          fills: [{ color: "#D6FFC4" }],
          name: `.kumulativ#${signal.id}`
        });
        break;

      case "prietok":   // Flow
        widget = await penpot.createShape("ellipse", {
          x: signal.initialX,
          y: signal.initialY,
          width: 90,
          height: 90,
          fills: [{ color: "#C4E4FF" }],
          name: `.prietok#${signal.id}`
        });
        break;

      case "hladina":   // Level
        widget = await penpot.createShape("rect", {
          x: signal.initialX,
          y: signal.initialY,
          width: 50,
          height: 120,
          fills: [{ color: "#B3A5FF" }],
          name: `.hladina#${signal.id}`
        });
        break;

      case "naplnenie":  // Fill %
        widget = await penpot.createShape("rect", {
          x: signal.initialX,
          y: signal.initialY,
          width: 80,
          height: 80,
          cornerRadius: 12,
          fills: [{ color: "#FFD6F2" }],
          name: `.naplnenie#${signal.id}`
        });
        break;

      default:
        // fallback giống logic cũ (value/gauge/indicator)
        if (signal.widgetType === "value") {
          widget = await penpot.createShape("rect", {
            x: signal.initialX,
            y: signal.initialY,
            width: 120,
            height: 40,
            fills: [{ color: "#C8EFFF" }],
            name: `.${signal.widgetType}#${signal.id}`
          });

          await penpot.createShape("text", {
            x: signal.initialX + 8,
            y: signal.initialY + 10,
            text: signal.label,
            fontSize: 14,
            fontFamily: "Work Sans"
          });

        } else if (signal.widgetType === "gauge") {
          widget = await penpot.createShape("ellipse", {
            x: signal.initialX,
            y: signal.initialY,
            width: 80,
            height: 80,
            fills: [{ color: "#FFD580" }],
            name: `.${signal.widgetType}#${signal.id}`
          });

        } else if (signal.widgetType === "indicator") {
          widget = await penpot.createShape("rect", {
            x: signal.initialX,
            y: signal.initialY,
            width: 30,
            height: 30,
            cornerRadius: 15,
            fills: [{ color: "#FF8B8B" }],
            name: `.${signal.widgetType}#${signal.id}`
          });
        }
    }

    created.push({
      id: signal.id,
      type: signal.type || signal.widgetType,
      widgetId: widget.id
    });
  }

  return created;
}

// ================================
(async function () {
  const signalList = [
    { id: "TEMP01", type: "teplota", label: "Temperature", initialX: 100, initialY: 100 },
    { id: "FLOW01", type: "prietok", label: "Flow rate", initialX: 300, initialY: 100 },
    { id: "LEVEL01", type: "hladina", label: "Level", initialX: 500, initialY: 100 },
  ];

  const result = await generateWidgets(signalList);

  penpot.ui.sendMessage({
    type: "complete",
    widgets: result,
  });
})();
