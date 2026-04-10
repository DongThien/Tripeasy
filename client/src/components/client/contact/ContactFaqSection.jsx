import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ContactFaqSection = ({ faqs, openFAQ, onToggleFAQ }) => (
    <section className="mx-auto mt-14 max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="text-center">
            <h2 className="text-4xl font-bold text-[#8B1A1A]">Câu hỏi thường gặp</h2>
            <span className="mt-3 inline-block h-1 w-16 rounded-full bg-[#8B1A1A]" />
            <p className="mt-3 text-gray-600">Những thắc mắc phổ biến của khách hàng Tripeasy</p>
        </div>

        <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {faqs.map((faq, index) => {
                const isOpen = openFAQ === index;

                return (
                    <article key={faq.question} className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                        <button
                            type="button"
                            onClick={() => onToggleFAQ(index)}
                            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                        >
                            <span className="font-semibold text-gray-800">{faq.question}</span>
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#8B1A1A]/10 text-[#8B1A1A]">
                                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </span>
                        </button>

                        <div
                            className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                        >
                            <div className="overflow-hidden">
                                <p className="px-5 pb-5 text-sm leading-6 text-gray-600">{faq.answer}</p>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    </section>
);

export default ContactFaqSection;