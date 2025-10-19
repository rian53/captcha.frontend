import React from "react";

export default function MainContent() {
  return (
    <div className="bg-neutral-100 md:pt-1.5">
      <div className="relative min-h-full bg-neutral-100 pt-px md:rounded-tl-2xl md:border md:border-b-0 md:border-r-0 md:border-neutral-200/80 md:bg-white">
        <div className="bg-neutral-100 md:bg-white">
          <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 mt-3 md:mt-6 md:py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="group flex items-center justify-center gap-2 whitespace-nowrap rounded-md border text-sm transition-all border-transparent text-neutral-600 hover:bg-neutral-100 h-auto w-fit p-1 md:hidden"
                >
                  <svg
                    height="18"
                    width="18"
                    viewBox="0 0 18 18"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4"
                  >
                    <g fill="currentColor">
                      <path
                        d="M4,2.75H14.25c1.105,0,2,.895,2,2V13.25c0,1.105-.895,2-2,2H4"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      ></path>
                      <rect
                        height="12.5"
                        width="4.5"
                        fill="none"
                        rx="2"
                        ry="2"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        x="1.75"
                        y="2.75"
                      ></rect>
                    </g>
                  </svg>
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">
                      Links
                    </h1>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 md:hidden">
                <button
                  type="button"
                  className="sm:inline-flex font-lg relative size-4 shrink-0 overflow-hidden rounded-full active:bg-gray-50 outline-none ring-offset-2 ring-offset-neutral-100 focus-visible:ring-2 focus-visible:ring-black/50"
                >
                  <div className="absolute inset-0 flex items-center justify-center font-medium text-neutral-500 hover:text-neutral-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-circle-help size-4"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <path d="M12 17h.01"></path>
                    </svg>
                  </div>
                </button>
                <button
                  className="sm:inline-flex group relative rounded-full ring-offset-1 ring-offset-neutral-100 transition-all hover:ring-2 hover:ring-black/10 active:ring-black/15 outline-none focus-visible:ring-2 focus-visible:ring-black/50"
                  type="button"
                >
                  <img
                    alt="Avatar mobile"
                    src="https://www.gravatar.com/avatar/e2507b8c8f472161cc1230e42553375b6b85a5a4e6ce7e9dc5e1e6f6520e689b"
                    className="rounded-full border border-gray-300 size-6 border-none duration-75 sm:size-6"
                    draggable="false"
                  />
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white pt-2.5 max-md:mt-3 max-md:rounded-t-[16px]">
            <div className="flex w-full items-center pt-3">
              <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 flex flex-col gap-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 lg:flex-nowrap">
                  <div className="flex w-full grow gap-2 md:w-auto">
                    <div className="grow basis-0 md:grow-0">
                      <button
                        type="button"
                        className="sm:inline-flex group flex h-10 cursor-pointer appearance-none items-center gap-x-2 truncate rounded-md border px-3 text-sm outline-none transition-all border-gray-200 bg-white text-gray-900"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-list-filter size-4 shrink-0"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M7 12h10"></path>
                          <path d="M10 18h4"></path>
                        </svg>
                        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left text-gray-900">
                          Filter
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                          className="lucide lucide-chevron-down size-4 shrink-0 text-gray-400"
                        >
                          <path d="m6 9 6 6 6-6"></path>
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grow basis-0 md:grow-0">
                      <button
                        type="button"
                        className="group flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border px-4 text-sm transition-all border-gray-200 bg-white text-gray-900"
                      >
                        <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><g fill="currentColor"><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="13.25" x2="16.25" y1="5.25" y2="5.25"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="1.75" x2="8.75" y1="5.25" y2="5.25"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="4.75" x2="1.75" y1="12.75" y2="12.75"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="16.25" x2="9.25" y1="12.75" y2="12.75"></line><circle cx="11" cy="5.25" fill="none" r="2.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></circle><circle cx="7" cy="12.75" fill="none" r="2.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></circle></g></svg>
                        <span className="grow text-left">Display</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-chevron-down h-4 w-4 text-gray-400 transition-transform"
                        >
                          <path d="m6 9 6 6 6-6"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-x-2 max-md:w-full">
                    <div className="w-full md:w-56 lg:w-64">
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <svg
                            height="18"
                            width="18"
                            viewBox="0 0 18 18"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-400"
                          >
                            <g fill="currentColor">
                              <circle
                                cx="7.75"
                                cy="7.75"
                                r="5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                fill="none"
                              ></circle>
                              <line
                                x1="15.25"
                                x2="11.285"
                                y1="15.25"
                                y2="11.285"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                              ></line>
                            </g>
                          </svg>
                        </div>
                        <input
                          className="peer w-full rounded-md border border-gray-200 px-10 text-black outline-none placeholder:text-gray-400 sm:text-sm transition-all focus:border-gray-500 focus:ring-4 focus:ring-gray-200 h-10"
                          placeholder="Search..."
                          type="text"
                        />
                      </div>
                    </div>
                    
                    <div className="grow-0">
                      <button
                        type="button"
                        className="group flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border px-4 text-sm transition-all border-black bg-black text-white hover:bg-gray-800 hover:ring-4 hover:ring-gray-200"
                      >
                        <div className="min-w-0 truncate flex-1 text-left">Create link</div>
                        <kbd className="hidden rounded px-2 py-0.5 text-xs font-light transition-all duration-75 md:inline-block bg-gray-700 text-gray-400 group-hover:bg-gray-600 group-hover:text-gray-300">
                          C
                        </kbd>
                      </button>
                    </div>
                    
                    <button
                      type="button"
                      className="group flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border text-sm transition-all border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus-visible:border-gray-500 outline-none sm:inline-flex w-auto px-1.5"
                    >
                      <svg
                        fill="none"
                        shapeRendering="geometricPrecision"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        className="h-5 w-5 text-gray-500"
                      >
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div
                  className="overflow-hidden w-full"
                  style={{ width: "auto", height: 0 }}
                >
                  <div className="h-max">
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 grid gap-y-2">
              <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-gray-200 px-4 py-10 md:min-h-[500px]">
                <div className="animate-fade-in h-36 w-full max-w-64 overflow-hidden px-4 [mask-image:linear-gradient(transparent,black_10%,black_90%,transparent)]">
                </div>
                
                <div className="max-w-xs text-pretty text-center">
                  <span className="text-base font-medium text-neutral-900">
                    No links found
                  </span>
                  <p className="mt-2 text-pretty text-sm text-neutral-500">
                    Start creating short links for your marketing campaigns,
                    referral programs, and more.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <button
                      type="button"
                      className="group flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border px-4 text-sm transition-all border-black bg-black text-white hover:bg-gray-800 hover:ring-4 hover:ring-gray-200"
                    >
                      <div className="min-w-0 truncate flex-1 text-left">
                        Create link
                      </div>
                      <kbd className="hidden rounded px-2 py-0.5 text-xs font-light transition-all duration-75 md:inline-block bg-gray-700 text-gray-400 group-hover:bg-gray-600 group-hover:text-gray-300">
                        C
                      </kbd>
                    </button>
                  </div>
                  <a
                    target="_blank"
                    className="transition-all border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus-visible:border-gray-500 outline-none data-[state=open]:border-gray-500 data-[state=open]:ring-4 data-[state=open]:ring-gray-200 flex items-center whitespace-nowrap rounded-lg border px-4 text-sm h-10"
                    href="https://dub.co/help/article/how-to-create-link"
                  >
                    Learn more
                  </a>
                </div>
              </div>
              
              <div className="h-[90px]"></div>
              
              <div className="fixed bottom-4 left-0 w-full sm:max-[1330px]:w-[calc(100%-150px)] md:left-[240px] md:w-[calc(100%-240px)] md:max-[1330px]:w-[calc(100%-240px-150px)]">
                <div className="relative left-1/2 w-full max-w-[768px] -translate-x-1/2 px-5 max-[1330px]:left-0 max-[1330px]:translate-x-0">
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3.5 [filter:drop-shadow(0_5px_8px_#222A351d)]">
                    <div className="flex items-center justify-between gap-2 text-sm leading-6 text-gray-600">
                      <div className="flex items-center gap-2">
                        <div>
                          <span className="hidden sm:inline-block">Viewing</span>{" "}
                          <span className="font-medium">0</span> links
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="flex h-7 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-600 outline-none hover:bg-gray-50"
                          disabled
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          className="flex h-7 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-600 outline-none hover:bg-gray-50"
                          disabled
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="fixed bottom-0 right-0 z-40 m-5">
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <button
                type="button"
                className="sm:inline-flex animate-slide-up-fade -mt-1 flex h-12 flex-col items-center justify-center rounded-full border border-gray-950 bg-gray-950 px-6 text-xs font-medium leading-tight text-white shadow-md transition-all [--offset:10px] hover:bg-gray-800 hover:ring-4 hover:ring-gray-200"
              >
                <span>Getting Started</span>
                <span className="text-gray-400">0% complete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
