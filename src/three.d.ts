// Декларации для импорта 3D-ассетов как URL (на будущее, для GLB из Blender)
declare module '*.glb' {
  const src: string
  export default src
}
declare module '*.gltf' {
  const src: string
  export default src
}
declare module '*.hdr' {
  const src: string
  export default src
}
declare module '*.exr' {
  const src: string
  export default src
}
