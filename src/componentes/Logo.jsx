export default function Logo({ size = 36 }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo.png`}
      alt="Altis Sistemas"
      width={size}
      height={size}
      style={{ objectFit: 'contain', display: 'block' }}
    />
  )
}
