export class Gauge {
  constructor(element){
    this.dom = {
      gauge: element,
      id: element.getAttribute('id'),
      settings: element.dataset.settings,
      valueArc: undefined,
      valueLabel: undefined
    };
    this.data = {};
  }

  init(){
    this.data = this.parseData();
    this.setDataDefaults();
    this.drawChart();
    this.injectTexture();
    // this.setRandomData();
  }

  setCanvas(selector, scale){
    return d3.select(selector)
      .append('svg')
        .attr('width', 250 * scale)
        .attr('height', 250 * scale)
        .append("g")
          .attr('transform', "translate(" + 125 * scale + ", " + 125 * scale + ")");
  }

  injectTexture(){
    var dTexture = window.document.querySelector('#diagonalTexture');
    if(dTexture == undefined){
      d3.select('body')
        .append('svg')
          .append('defs')
            .append('pattern')
              .attr('id','diagonalTexture')
              .attr('width', 5)
              .attr('height', 5)
              .attr('patternUnits',"userSpaceOnUse")
              .append('path')
                .attr('fill','white')
                .attr('stroke','#767676')
                .attr('stroke-width','1')
                .attr('d','M0 5L5 0ZM6 4L4 6ZM-1 1L1 -1Z');
    }
  }

  getScale(size) {
    switch (size) {
      case 'small':
        return .5;
      case 'medium':
        return .75;
      case 'large':
        return 1;
      default:
        return .75;
    }
  }

  createArc(options) {
    var s = options.scale || .75;
    return d3.arc()
             .innerRadius(options.radius.inner * s)
             .outerRadius(options.radius.outer * s)
             .startAngle(options.angle.start * (Math.PI / 180))
             .endAngle(options.angle.end * (Math.PI / 180));
  }

  drawArc(canvas, options) {
    var createArc = this.createArc;
    return canvas.append("path")
            .attr("class", options.props.class || "arc")
            .attr("d", createArc(options.arc))
            .attr("fill", options.props.color)
            .attr("opacity", options.props.opacity || 1);
  }

  drawLabel(canvas, options) {
    return canvas.append('g')
            .attr('transform', "translate(" +
              (options.x * options.scale || 0) + "," +
              (options.y * options.scale || 0) + ")")
            .append('text')
            .text(options.message)
            .style('font-size', (options.fontSize * options.scale) + 'px' )
            .attr('class', options.class || 'text');
  }

  parseData(){
    return JSON.parse(this.dom.settings);
  }

  setDataDefaults(){
    this.data.value = this.data.value || 0;
    this.data.min = this.data.min || 0;
    this.data.max = this.data.max || 100;
    this.data.units = this.data.units || "%";
    this.data.scale = this.getScale(this.data.size) || .75;
  }

  setValue(value){
    var _parentThis = this;
    var valueArc = this.dom.valueArc;
    var limits = this.dom.settings.limits;
    var arcTween = this.arcTween;
    var prevAngle = this.val2angle(this.data.value);
    var newAngle = this.val2angle(value);
    valueArc
      .transition()
      .duration(750)
      .attrTween('d', arcTween(newAngle, prevAngle, _parentThis));
    this.data.value = this.angle2value(newAngle);
  }

  setRandomData(){
    var _parentThis = this;
    d3.interval(function () {
      var randomAngle = Math.random() * 270 - 135;
      var randomValue = _parentThis.angle2value(randomAngle, _parentThis);
      _parentThis.setValue(randomValue);
    }, 1500);
  }

  val2angle(value) {
    var scale =
      d3.scaleLinear()
        .domain([this.data.min, this.data.max])
        .range([-135, 135]);
    return scale(value);
  }

  angle2value(angle, _parentThis) {
    var _this = _parentThis != undefined ? _parentThis : this;
    var scale =
      d3.scaleLinear()
        .domain([-135, 135])
        .range([_this.data.min, _this.data.max]);
    return scale(angle);
  }

  setLabelAngle(angle, _parentThis) {
    var valueLabel = _parentThis.dom.valueLabel;
    var decimals = _parentThis.parseData().decimals;
    valueLabel.text(function (d) {
      return _parentThis.angle2value(angle, _parentThis).toFixed(decimals);
    });
  }

  arcTween(newAngle, oldAngle, _parentThis) {
    var createArc = _parentThis.createArc;
    var setArcColor = _parentThis.setArcColor;
    var setLabelAngle = _parentThis.setLabelAngle;
    var angle2value = _parentThis.angle2value;
    return function (d) {
      var interpolate = d3.interpolate(oldAngle, newAngle);
      return function (t) {
        oldAngle = interpolate(t);
        var arc = createArc({
          angle: { start: -135, end: oldAngle },
          radius: { inner: 95, outer: 102 },
          scale: _parentThis.data.scale
        });
        setLabelAngle(oldAngle, _parentThis);
        var decimals = _parentThis.data.decimals || 0;
        var val = angle2value(oldAngle, _parentThis);
        setArcColor(parseFloat(val).toFixed(decimals), _parentThis.data.limits, _parentThis);
        return arc(t);
      };
    };
  }

  setArcColor(value, limits, _parentThis) {
    var d = _parentThis != undefined ? _parentThis.dom : this.dom;
    d.valueArc.attr('class', 'valueArc');
    if(limits){
      limits.forEach( limit => {
        if(value >= limit.from && value <= limit.to){
          if(limit.color != 'transparent'
          && limit.color != 'unknown'
          && limit.color != 'gray'){
            d.valueArc.attr('class', limit.color);
          }
        }
      });
    }
  }

  drawChart() {
    // variables
    var gScale = this.data.scale;

    //  set canvas
    var svg = this.setCanvas('#'+this.dom.id, gScale);

    // foreground arc
    this.drawArc(svg, {
      arc: {
        radius: { inner: 95, outer: 102 },
        angle: { start: -135, end: 135 },
        scale: gScale
      },
      props: {
        class: "foregroundArc"
      }
    });

    // value arc
    this.dom.valueArc = this.drawArc(svg, {
      arc: {
        radius: { inner: 95, outer: 102 },
        angle: { start: -135, end: this.val2angle(this.data.value) },
        scale: gScale
      },
      props: {
        class: "valueArc"
      }
    });

    // set value arc color
    this.setArcColor(this.data.value, this.data.limits);

    // negative arcs
    var frequency = 275 / 37, length = 5;
    for (var i = -140; i < 135; i = i + frequency) {
      this.drawArc(svg, {
        arc: {
          radius: { inner: 94, outer: 103 },
          angle: { start: i, end: i + length },
          scale: gScale
        },
        props: {
          class: "negativeArc"
        }
      });
    }

    // draw limits
    if(this.data.limits){
      this.data.limits.forEach( limit => {
        var limitArc = this.drawArc(svg, {
          arc: {
            radius: { inner: 82, outer: 87 },
            angle: {
              start: this.val2angle(limit.from) + 1,
              end: this.val2angle(limit.to) - 1
            },
            scale: gScale
          },
          props: {
            class: limit.color,
            opacity: 0.3
          }
        });

        // limit hover arc
        var limitHoverArc = this.drawArc(svg, {
          arc: {
            radius: { inner: 72, outer: 117 },
            angle: {
              start: this.val2angle(limit.from) + 1,
              end: this.val2angle(limit.to) - 1
            },
            scale: gScale
          },
          props: {
            class: 'transparent'
          }
        });

        // tooltip
        var tooltip =
          d3.select('#' + this.dom.id)
            .append('div')
            .attr('class', 'tooltip hidden')
            .style('left', '0px')
            .style('top', '0px')
            .html(limit.label);

        // animation
        limitHoverArc.on('mouseenter', () => {
          tooltip.node().classList.remove('hidden');
          limitArc.style('opacity', 1);
        });
        limitHoverArc.on('mousemove', () => {
          tooltip.style('left', d3.event.clientX + 0 + 'px').style('top', d3.event.clientY - 40 + 'px');
        });
        limitHoverArc.on('mouseleave', () => {
          tooltip.node().classList.add('hidden');
          limitArc.style('opacity', 0.3);
        });
      });
    }

    // labels
    this.drawLabel(svg, {
      message: this.data.units,
      class: 'units',
      x: 0,
      y: 40,
      fontSize: 28,
      scale: gScale
    });

    this.drawLabel(svg, {
      message: this.data.min,
      class: 'label left',
      x: -65,
      y: 110,
      fontSize: 24,
      scale: gScale
    });

    this.drawLabel(svg, {
      message: this.data.max,
      class: 'label right',
      x: 65,
      y: 110,
      fontSize: 24,
      scale: gScale
    });

    this.dom.valueLabel = this.drawLabel(svg, {
      message: this.data.value,
      class: 'total',
      fontSize: 60,
      scale: gScale
    });
  }
}
