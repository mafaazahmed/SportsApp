export default function Footer() {
  return (
    <>
      <footer
        className="d-flex flex-wrap justify-content-between align-items-center text-white mt-3"
        style={{
          backgroundColor: "purple",
          display : 'flex',
          height : '60px',
          position : "relative",
          bottom : 0,
          width : '100%',
          alignItems : 'end'
        }}
      >
        <div className="w-100 text-center">© 2025 SportsProducts, Inc</div>
      </footer>
    </>
  );
}
