(({movingStep, logo, rectColor}) => {
  const canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    cw = canvas.width,
    ch = canvas.height,
    state = {
      logoCenter: {
        x: cw / 2,
        y: ch / 2
      }
    };

  const cx0 = (logoCenter) => {
    const ccx = logoCenter.x;
    const crx = logo.width / 2;
    return ccx - crx;
  };

  const cy0 = (logoCenter) => {
    const ccy = logoCenter.y;
    const cry = logo.height / 2;
    return ccy - cry;
  };

  const drawRect = ({x, y, w, h}, rectColor) => {
    ctx.fillStyle = rectColor;
    ctx.fillRect(x, y, w, h);
  };

  const coordsRect = (item, logoCenter) => {
    const {
      offset,
    } = item;
    const x = cx0(logoCenter);
    const y = cy0(logoCenter);
    return {
      x: (offset.x) ? (x + offset.x) : x,
      y: (offset.y) ? (y + offset.y) : y,
    };
  };

  const clearAll = () => {
    // Starting point rectangles
    ctx.clearRect(0, 0, cw, ch);
  };
  const drawRects = (rects, rectColor) => {
    rects.forEach((config) => {
      drawRect(config, rectColor);
    });
  };
  const createRects = (items, logoCenter) => {
    return items.map((item) => {
      const {width: w, height: h} = item;
      const {x, y} = coordsRect(item, logoCenter);
      return {x, y, w, h};
    });
  };

  const render = (logoCenter, rectColor) => {
    clearAll();

    const rects = createRects(logo.items, logoCenter);
    drawRects(rects, rectColor);
    const offsets = [
      {x: -1, y: -1},
      {x: -1, y: 0},
      {x: -1, y: 1},

      {x: 0, y: -1},
      {x: 0, y: 1},

      {x: 1, y: -1},
      {x: 1, y: 0},
      {x: 1, y: 1},
    ];
    const reflectedLogoCenters = offsets.map(({x, y}) => {
      return {
        x: logoCenter.x + x * cw,
        y: logoCenter.y + y * ch,
      };
    });
    reflectedLogoCenters.forEach(reflectedLogoCenter => {
      const rects = createRects(logo.items, reflectedLogoCenter);
      drawRects(rects, rectColor);
    });
  };

  render(state.logoCenter, rectColor);

  const computeLogoCenterCoords = {
    y: (y) => {
      if (y >= ch) {
        return y - ch;
      }
      if (y <= 0) {
        return ch + y;
      }
      return y;
    },
    x: (x) => {
      if (x >= cw) {
        return x - cw;
      }
      if (x <= 0) {
        return cw + x;
      }
      return x;
    }
  };
  const move = (axis, movingStep, logoCenter) => {
    let position = logoCenter[axis] + movingStep;
    position = computeLogoCenterCoords[axis](position);
    const next = {...logoCenter};
    next[axis] = position;
    return next;
  };
  const moveTo = {
    y: (movingStep, logoCenter) => move('y', movingStep, logoCenter),
    x: (movingStep, logoCenter) => move('x', movingStep, logoCenter),
  };
  const logoCenterUpdaters = {
    ArrowUp: (movingStep, logoCenter) => {
      return moveTo.y(-1 * movingStep, logoCenter);
    },
    ArrowDown: (movingStep, logoCenter) => {
      return moveTo.y(movingStep, logoCenter);
    },
    ArrowRight: (movingStep, logoCenter) => {
      return moveTo.x(movingStep, logoCenter);
    },
    ArrowLeft: (movingStep, logoCenter) => {
      return moveTo.x(-1 * movingStep, logoCenter);
    },
  };

  window.addEventListener('keydown', function (event) {
    if (event.defaultPrevented) {
      return; // Should do nothing if the default action has been cancelled
    }

    const handled = false;
    if (event.key !== undefined) {
      const nextLogoCenter = logoCenterUpdaters[event.key](movingStep, state.logoCenter);
      render(nextLogoCenter, rectColor);
      state.logoCenter = nextLogoCenter;
    }

    if (handled) {
      // Suppress "double action" if event handled
      event.preventDefault();
    }
  }, true);
})({
  movingStep: 25,
  logo: ((obj) => {
    const {thickness, gap, vertical, horizontal} = obj;
    return {
      height: vertical.length + gap.y + thickness,
      width: horizontal.length + 2 * (gap.x + thickness),
      items: [
        {
          title: 'left vertical line',
          width: thickness,
          height: vertical.length,
          offset: {
            x: 0,
            y: gap.y + thickness
          },
        },
        {
          title: 'right vertical line',
          width: thickness,
          height: vertical.length,
          offset: {
            x: thickness + gap.x + horizontal.length + gap.x,
            y: gap.y + thickness,
          },
        },
        {
          title: 'horizontal line',
          width: horizontal.length,
          height: thickness,
          offset: {
            x: gap.x + thickness,
          },
        },
      ],
    };
  })({
    thickness: 16,
    gap: {x: 22, y: 22},
    vertical: {length: 150},
    horizontal: {length: 100}
  }),
  rectColor: '#fff',
  backgroundColor: '#000'
});

