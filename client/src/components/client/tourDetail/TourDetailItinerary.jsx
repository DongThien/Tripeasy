import React from 'react';

const TourDetailItinerary = ({ itinerary }) => (
    <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 md:p-6">
        <h2 className="text-2xl font-bold text-gray-900">Lịch trình chi tiết</h2>

        <div className="mt-6 space-y-5">
            {itinerary.map((item) => (
                <article key={item.day} className="relative pl-11 md:pl-12">
                    <span className="absolute left-0 top-1.5 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#8B1A1A] px-2 text-xs font-semibold text-white">
                        {item.day}
                    </span>
                    {item.day !== itinerary[itinerary.length - 1].day ? (
                        <span className="absolute left-[13px] top-9 h-[calc(100%+8px)] w-px bg-[#8B1A1A]/25" />
                    ) : null}

                    <div className="rounded-lg bg-[#FAF8F8] p-4 ring-1 ring-gray-100 md:p-5">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-900">
                                Ngày {item.day}: {item.title}
                            </h3>
                            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                                Ăn sáng, trưa, tối
                            </span>
                        </div>
                        <p className="text-sm leading-6 text-gray-600">{item.content}</p>

                        <div className="mt-3 grid grid-cols-2 gap-2 md:gap-3">
                            {item.images.slice(0, 2).map((img) => (
                                <img
                                    key={img}
                                    src={img}
                                    alt={`Ngày ${item.day}`}
                                    className="h-24 w-full rounded-md object-cover md:h-28"
                                />
                            ))}
                        </div>
                    </div>
                </article>
            ))}
        </div>
    </section>
);

export default TourDetailItinerary;