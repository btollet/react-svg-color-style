import React, { Component } from 'react'
import SvgParser from '../functions/SvgParser'
import isSvg from 'is-svg'

export default class SvgColor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            svg: null,
			file: null
        }
        this.getSvgData = this.getSvgData.bind(this);
    }

	componentDidMount() {
		this.getSvgData()
	}

    componentDidUpdate() {
		this.getSvgData()
    }

    async getSvgData() {
        let { svg } = this.props

		if (this.state.file !== svg) {
			this.setState({ file: svg });

			let data = await fetch(svg).then(res => {
				let reader = res.body.getReader();
				let decoder = new TextDecoder('utf-8');

				return reader.read().then(result => {
					return decoder.decode(result.value);
				})
			})

			if (this.state.svg !== data)
				this.setState({ svg: data });
		}
    }

    render() {
        let { svg } = this.state
        let { colors, width, rotate, style, className, onClick, onMouseEnter, onMouseLeave } = this.props

        if(svg != null && isSvg(svg)) {

            svg = SvgParser.decode(svg)
            svg = (colors != null && Array.isArray(colors)) ? SvgParser.changeColors(svg, colors) : svg
            svg = (rotate != null && !isNaN(rotate)) ? SvgParser.changeRotate(svg, rotate) : svg
            svg = SvgParser.encode(svg)

			if (!style)
				style = {}

			if (width != null && !isNaN(width))
				style.width = width;

            return (
                React.createElement("div", null,
                    React.createElement("img", {src: svg, style, className, onClick, onMouseEnter, onMouseLeave})
                )
            )
        }
        else {
            return React.createElement("div", null)
        }
    }
}
