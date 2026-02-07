import { useMemo } from 'react'
import { useControlBlock } from '~/hooks/useControlBlock'
import { hsvToRgb } from '~/lib/color'
import type { Hsva } from '~/lib/color'

export default function Palette({
  color,
  setColor,
}: {
  color: Hsva
  setColor: (color: Hsva) => void
}) {
  const { h, s, v } = color

  const { blockRef, handlerRef, onMouseDown } = useControlBlock({
    value: [s, 1 - v],
    onChange: (value) => {
      setColor({
        ...color,
        s: value[0],
        v: 1 - value[1],
      })
    },
  })

  const hueColor = useMemo(() => {
    const rgb = hsvToRgb({
      h,
      s: 1,
      v: 1,
    })
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  }, [h])

  return (
    <div
      ref={blockRef}
      onMouseDown={onMouseDown as any}
      style={{ backgroundColor: hueColor }}
      className='relative size-36 cursor-pointer bg-red-400 bg-panel'
    >
      <div
        ref={handlerRef}
        className='absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-transparent'
        style={{
          left: `${s * 100}%`,
          top: `${(1 - v) * 100}%`,
        }}
      />
    </div>
  )
}
