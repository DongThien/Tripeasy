import React from 'react';

const ContactHero = () => (
    <section className="relative h-[300px] overflow-hidden bg-gradient-to-br from-[#3f322a] via-[#5b4638] to-[#7a3f30]">
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center text-white md:px-6 lg:px-8">
            <p className="mb-4 text-sm text-white/85">Trang chủ &nbsp;&bull;&nbsp; Liên hệ</p>
            <h1 className="text-4xl font-bold md:text-5xl">Liên hệ với chúng tôi</h1>
            <p className="mt-3 max-w-2xl text-white/90">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc mọi nơi.
            </p>
        </div>
    </section>
);

export default ContactHero;