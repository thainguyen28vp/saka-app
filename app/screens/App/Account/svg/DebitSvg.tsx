import { WIDTH } from '@app/theme'
import * as React from 'react'
import Svg, { Rect } from 'react-native-svg'
const SVGComponent = ({ widthDebit, ...props }: any) => (
  <Svg
    width={WIDTH - 32}
    height={21}
    viewBox={`0 0 ${WIDTH - 32} 21`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={WIDTH - 32} height={21} fill="#183C80" />
    <Rect width={widthDebit} height={21} fill="#FF9838" />
  </Svg>
)
export default SVGComponent
