export default function Logo({ size = 36 }) {
  return (
    <img
      src="/logo.png"
      alt="Altis Sistemas"
      width={size}
      height={size}
      style={{ objectFit: 'contain', display: 'block' }}
    />
  )
}
