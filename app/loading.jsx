export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FAF7F0] select-none">
      <div className="relative w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] md:w-[540px] md:h-[540px] max-w-[92vw] max-h-[82vh] flex items-center justify-center">
        <picture className="w-full h-full flex items-center justify-center">
          <source srcSet="/loading.webp" type="image/webp" />
          <img
            src="/loading.webp"
            alt="Loading..."
            className="w-full h-full object-contain pointer-events-none bg-transparent"
          />
        </picture>
      </div>
    </div>
  );
}
