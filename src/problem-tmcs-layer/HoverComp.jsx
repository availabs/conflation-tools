import React from "react"

const HoverComp = props => {
  return (
    <div className={ `px-2 py-1 bg-gray-100 rounded opacity-75` }>
      <div className="whitespace-pre-wrap">
        { JSON.stringify(props.data, null, 3) }
      </div>
    </div>
  )
}
export default HoverComp;