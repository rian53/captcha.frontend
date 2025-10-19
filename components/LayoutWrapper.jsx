function LayoutWrapper({ children }) {
  return (
    <div className="bg-white pt-2.5 max-md:mt-0 max-md:rounded-t-[16px]">

      <div className="mt-3">
        <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 grid gap-y-2">
          {children}
        </div>
      </div>
    </div>
  )
}

export default LayoutWrapper