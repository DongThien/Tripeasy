import React from 'react';
import { Link } from 'react-router-dom';

const DESTINATIONS = [
    {
        name: 'Đà Nẵng',
        label: 'Đà Nẵng',
        image: 'https://images.unsplash.com/photo-1722526933541-9a9cdfcdb28f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8JUM0JTkwJUMzJUEwJTIwTiVFMSVCQSVCNW5nfGVufDB8fDB8fHww',
        className: 'md:col-span-2 md:row-span-2',
    },
    {
        name: 'Hà Nội',
        label: 'Hà Nội',
        image: 'https://images.unsplash.com/photo-1616486410185-81af2d32a2af?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8SCVDMyVBMCUyME4lRTElQkIlOTlpfGVufDB8fDB8fHww',
        className: 'md:col-span-2 md:row-span-1',
    },
    {
        name: 'Côn Đảo',
        label: 'Côn Đảo',
        image: 'https://images.unsplash.com/photo-1574065319961-ca02565d5c50?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEMlQzMlQjRuJTIwJUM0JTkwJUUxJUJBJUEzb3xlbnwwfHwwfHx8MA%3D%3D',
        className: 'md:col-span-2 md:row-span-1',
    },
    {
        name: 'Nha Trang',
        label: 'Nha Trang',
        image: 'https://images.unsplash.com/photo-1669783517838-36886de8bbb3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fE5oYSUyMFRyYW5nfGVufDB8fDB8fHww',
        className: 'md:col-span-2 md:row-span-1 md:col-start-3 md:row-start-3',
    },
    {
        name: 'Đà Lạt',
        label: 'Đà Lạt',
        image: 'https://images.unsplash.com/photo-1580824378537-e119885b93f7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8JUM0JTkwJUMzJUEwJTIwTCVFMSVCQSVBMXR8ZW58MHx8MHx8fDA%3D',
        className: 'md:col-span-2 md:row-span-1 md:col-start-1 md:row-start-3',
    },
];

const DestinationHighlights = () => (
    <section className="max-w-7xl mx-auto mt-20 px-4">
        <div className="flex flex-col items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
                Điểm đến yêu thích
            </h2>
            <span className="block h-1 w-16 bg-[#8B1A1A] rounded mt-4 mb-2" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 md:auto-rows-[200px]">
            {DESTINATIONS.map((destination) => (
                <Link
                    key={destination.name}
                    to={`/client/tours?q=${encodeURIComponent(destination.name)}`}
                    className={`group relative overflow-hidden rounded-2xl shadow-lg ${destination.className || ''}`}
                >
                    <img
                        src={destination.image}
                        alt={destination.label}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-0 flex items-end justify-center p-5 transition-all duration-300 group-hover:items-center">
                        <div className="text-white text-lg md:text-xl font-semibold drop-shadow transition-all duration-300 group-hover:text-2xl">
                            {destination.label}
                        </div>
                    </div>
                    <div className="absolute inset-0 ring-2 ring-transparent transition-all duration-300 group-hover:ring-white/70" />
                    <div className="absolute inset-0 rounded-2xl bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                    <div className="aspect-[4/3] md:aspect-auto md:h-full" />
                </Link>
            ))}
        </div>
    </section>
);

export default DestinationHighlights;
