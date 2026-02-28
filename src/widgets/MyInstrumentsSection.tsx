'use client';

import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from "@/shared/lib/utils";
import { useInstrumentStore } from "@/shared/store/useInstrumentStore";
import { InstrumentCard } from "@/entities/instrument/ui/InstrumentCard";

// --- КАСТОМНЫЕ ИКОНКИ ИЗ FIGMA ---
const PayLinkIcon = ({ size = 20, className }: { size?: number | string, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M13.1742 9.32592C11.8837 8.03543 9.81093 8.00323 8.48189 9.22934C8.14362 9.54141 7.61641 9.52017 7.30433 9.1819C6.99226 8.84363 7.0135 8.31642 7.35177 8.00434C9.3355 6.17425 12.4272 6.22193 14.3527 8.14741C16.3271 10.1218 16.3271 13.3229 14.3527 15.2973L11.9642 17.6858C9.98978 19.6602 6.78867 19.6602 4.81428 17.6858C2.8399 15.7114 2.8399 12.5103 4.81428 10.536L5.20124 10.149C5.52668 9.82356 6.05431 9.82356 6.37975 10.149C6.70519 10.4744 6.70519 11.0021 6.37975 11.3275L5.9928 11.7145C4.66929 13.038 4.66929 15.1838 5.9928 16.5073C7.31631 17.8308 9.46214 17.8308 10.7857 16.5073L13.1742 14.1188C14.4977 12.7953 14.4977 10.6494 13.1742 9.32592Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M14.0077 3.49255C12.6842 2.16904 10.5383 2.16904 9.21484 3.49255L6.82629 5.8811C5.50278 7.20461 5.50278 9.35044 6.82629 10.674C8.11679 11.9644 10.1896 11.9966 11.5186 10.7705C11.8569 10.4585 12.3841 10.4797 12.6962 10.818C13.0082 11.1562 12.987 11.6835 12.6487 11.9955C10.665 13.8256 7.57326 13.7779 5.64778 11.8525C3.6734 9.87808 3.6734 6.67697 5.64778 4.70259L8.03633 2.31404C10.0107 0.339656 13.2118 0.339656 15.1862 2.31404C17.1606 4.28842 17.1606 7.48953 15.1862 9.46392L14.7993 9.85087C14.4738 10.1763 13.9462 10.1763 13.6207 9.85087C13.2953 9.52544 13.2953 8.9978 13.6207 8.67236L14.0077 8.28541C15.3312 6.9619 15.3312 4.81606 14.0077 3.49255Z" fill="currentColor"/>
  </svg>
);

const QrPosIcon = ({ size = 20, className }: { size?: number | string, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14.1927 1.14581H7.80722C5.08747 1.14581 4.10205 2.13123 4.10205 4.90025V17.0997C4.10205 19.8687 5.08747 20.8541 7.80722 20.8541H14.1829C16.9125 20.8541 17.8979 19.8687 17.8979 17.0997V4.90025C17.8979 2.13123 16.9125 1.14581 14.1927 1.14581ZM11 19.1789C10.054 19.1789 9.27549 18.4005 9.27549 17.4545C9.27549 16.5085 10.054 15.73 11 15.73C11.946 15.73 12.7244 16.5085 12.7244 17.4545C12.7244 18.4005 11.946 19.1789 11 19.1789ZM12.9708 4.34842H9.02913C8.62511 4.34842 8.29007 4.01338 8.29007 3.60935C8.29007 3.20533 8.62511 2.87029 9.02913 2.87029H12.9708C13.3748 2.87029 13.7099 3.20533 13.7099 3.60935C13.7099 4.01338 13.3748 4.34842 12.9708 4.34842Z" fill="currentColor"/>
  </svg>
);

const QrCodeIcon = ({ size = 20, className }: { size?: number | string, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M5.4437 1.83332L5.50017 1.83332L5.55664 1.83332C6.15626 1.83326 6.695 1.83321 7.13106 1.89184C7.60714 1.95584 8.09555 2.10446 8.49562 2.50453C8.89569 2.9046 9.04431 3.39302 9.10832 3.86909C9.16695 4.30516 9.1669 4.8439 9.16684 5.44351L9.16684 5.49999L9.16684 5.55646C9.1669 6.15608 9.16695 6.69482 9.10832 7.13088C9.04431 7.60696 8.89569 8.09537 8.49562 8.49544C8.09555 8.89551 7.60714 9.04413 7.13106 9.10814C6.695 9.16677 6.15626 9.16671 5.55665 9.16666L5.50017 9.16665L5.44369 9.16666C4.84408 9.16671 4.30534 9.16677 3.86928 9.10814C3.3932 9.04413 2.90479 8.89551 2.50472 8.49544C2.10465 8.09537 1.95603 7.60696 1.89202 7.13088C1.83339 6.69482 1.83344 6.15608 1.8335 5.55646L1.8335 5.49999L1.8335 5.44351C1.83344 4.8439 1.83339 4.30516 1.89202 3.86909C1.95603 3.39302 2.10465 2.9046 2.50472 2.50453C2.90479 2.10446 3.3932 1.95584 3.86928 1.89184C4.30534 1.83321 4.84408 1.83326 5.4437 1.83332Z" fill="currentColor"/>
    <path d="M5.4437 12.8333L5.50017 12.8333L5.55664 12.8333C6.15626 12.8333 6.695 12.8332 7.13106 12.8918C7.60714 12.9558 8.09555 13.1045 8.49562 13.5045C8.89569 13.9046 9.04431 14.393 9.10832 14.8691C9.16695 15.3052 9.1669 15.8439 9.16684 16.4435L9.16684 16.5L9.16684 16.5565C9.1669 17.1561 9.16695 17.6948 9.10832 18.1309C9.04431 18.607 8.89569 19.0954 8.49562 19.4954C8.09555 19.8955 7.60714 20.0441 7.13106 20.1081C6.695 20.1668 6.15626 20.1667 5.55665 20.1667L5.50017 20.1667L5.44369 20.1667C4.84408 20.1667 4.30534 20.1668 3.86928 20.1081C3.3932 20.0441 2.90479 19.8955 2.50472 19.4954C2.10465 19.0954 1.95603 18.607 1.89202 18.1309C1.83339 17.6948 1.83344 17.1561 1.8335 16.5565L1.8335 16.5L1.8335 16.4435C1.83344 15.8439 1.83339 15.3052 1.89202 14.8691C1.95603 14.393 2.10465 13.9046 2.50472 13.5045C2.90479 13.1045 3.3932 12.9558 3.86928 12.8918C4.30534 12.8332 4.84408 12.8333 5.4437 12.8333Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M1.8335 11C1.8335 10.4937 2.2439 10.0833 2.75016 10.0833L8.25016 10.0833C8.75642 10.0833 9.16683 10.4937 9.16683 11C9.16683 11.5062 8.75642 11.9166 8.25016 11.9166L2.75016 11.9166C2.2439 11.9166 1.8335 11.5062 1.8335 11Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M11.0002 1.83331C11.5064 1.83331 11.9168 2.24372 11.9168 2.74998V7.33331C11.9168 7.83957 11.5064 8.24998 11.0002 8.24998C10.4939 8.24998 10.0835 7.83957 10.0835 7.33331V2.74998C10.0835 2.24372 10.4939 1.83331 11.0002 1.83331Z" fill="currentColor"/>
    <path d="M16.4437 1.83332L16.5002 1.83332L16.5566 1.83332C17.1563 1.83326 17.695 1.83321 18.1311 1.89184C18.6071 1.95584 19.0956 2.10446 19.4956 2.50453C19.8957 2.9046 20.0443 3.39302 20.1083 3.86909C20.1669 4.30516 20.1669 4.8439 20.1668 5.44351L20.1668 5.49999L20.1668 5.55646C20.1669 6.15608 20.1669 6.69482 20.1083 7.13088C20.0443 7.60696 19.8957 8.09537 19.4956 8.49544C19.0956 8.89551 18.6071 9.04413 18.1311 9.10814C17.695 9.16677 17.1563 9.16671 16.5566 9.16666L16.5002 9.16665L16.4437 9.16666C15.8441 9.16671 15.3053 9.16677 14.8693 9.10814C14.3932 9.04413 13.9048 8.89551 13.5047 8.49544C13.1046 8.09537 12.956 7.60696 12.892 7.13088C12.8334 6.69482 12.8334 6.15608 12.8335 5.55646L12.8335 5.49999L12.8335 5.44351C12.8334 4.8439 12.8334 4.30516 12.892 3.86909C12.956 3.39302 13.1046 2.9046 13.5047 2.50453C13.9048 2.10446 14.3932 1.95584 14.8693 1.89184C15.3053 1.83321 15.8441 1.83326 16.4437 1.83332Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M13.6937 10.0833C13.7125 10.0833 13.7313 10.0833 13.7502 10.0833H19.2502C19.7564 10.0833 20.1668 10.4937 20.1668 11C20.1668 11.5062 19.7564 11.9167 19.2502 11.9167H13.7502C13.0761 11.9167 12.6627 11.9186 12.3636 11.9588C12.1006 11.9942 12.0567 12.0445 12.0515 12.0504C12.0513 12.0506 12.0512 12.0508 12.0511 12.0509C12.051 12.051 12.0508 12.0511 12.0506 12.0513C12.0446 12.0565 11.9944 12.1004 11.959 12.3634C11.9188 12.6625 11.9168 13.0759 11.9168 13.75C11.9168 14.2562 11.5064 14.6667 11.0002 14.6667C10.4939 14.6667 10.0835 14.2562 10.0835 13.75C10.0835 13.7311 10.0835 13.7123 10.0835 13.6935C10.0834 13.0939 10.0834 12.5552 10.142 12.1191C10.206 11.643 10.3546 11.1546 10.7547 10.7545C11.1548 10.3545 11.6432 10.2058 12.1193 10.1418C12.5553 10.0832 13.0941 10.0833 13.6937 10.0833ZM17.8866 14.7089C17.5876 14.6686 17.1743 14.6667 16.5002 14.6667C15.9939 14.6667 15.5835 14.2562 15.5835 13.75C15.5835 13.2437 15.9939 12.8333 16.5002 12.8333C16.5191 12.8333 16.5379 12.8333 16.5567 12.8333C17.1563 12.8333 17.6951 12.8332 18.1312 12.8919C18.6076 12.9561 19.0961 13.105 19.4961 13.5056C19.8959 13.906 20.0444 14.3947 20.1083 14.8711C20.1669 15.3076 20.1669 15.8469 20.1668 16.4475C20.1668 16.4663 20.1668 16.4851 20.1668 16.504C20.1668 16.5228 20.1668 16.5417 20.1668 16.5604C20.1669 17.161 20.1669 17.7004 20.1083 18.1369C20.0444 18.6132 19.8959 19.1019 19.4961 19.5023C18.9202 20.0791 18.1429 20.1452 17.4445 20.1662C16.9385 20.1815 16.5159 19.7837 16.5006 19.2776C16.4853 18.7716 16.8832 18.349 17.3892 18.3337C17.73 18.3235 17.9313 18.3 18.0616 18.2666C18.1668 18.2397 18.1906 18.2153 18.198 18.2077C18.1983 18.2074 18.1985 18.2072 18.1988 18.2069C18.1989 18.2068 18.1991 18.2067 18.1993 18.2065C18.2055 18.201 18.2559 18.1565 18.2913 17.8929C18.3316 17.5931 18.3335 17.179 18.3335 16.504C18.3335 15.829 18.3316 15.4148 18.2913 15.115C18.2559 14.8514 18.2055 14.807 18.1993 14.8015C18.1991 14.8013 18.1989 14.8011 18.1988 14.801C18.1987 14.8009 18.1986 14.8007 18.1984 14.8005C18.1931 14.7945 18.1492 14.7442 17.8866 14.7089ZM13.7502 12.8333C14.2564 12.8333 14.6668 13.2437 14.6668 13.75V15.125C14.6668 15.3611 14.6973 15.4746 14.7135 15.5172C14.7422 15.528 14.8062 15.5468 14.9296 15.5607C15.0958 15.5795 15.3015 15.5833 15.5835 15.5833C16.596 15.5833 17.4168 16.4041 17.4168 17.4167C17.4168 17.9229 17.0064 18.3333 16.5002 18.3333C15.9939 18.3333 15.5835 17.9229 15.5835 17.4167C15.308 17.4167 15.0058 17.4143 14.7237 17.3825C14.4421 17.3506 14.1118 17.2831 13.802 17.1101C13.0665 16.6996 12.8335 15.9445 12.8335 15.125V13.75C12.8335 13.2437 13.2439 12.8333 13.7502 12.8333ZM11.0002 15.3718C11.5064 15.3718 11.9168 15.7822 11.9168 16.2884V18.8269C11.9168 19.3332 11.5064 19.7436 11.0002 19.7436C10.4939 19.7436 10.0835 19.3332 10.0835 18.8269V16.2884C10.0835 15.7822 10.4939 15.3718 11.0002 15.3718ZM12.8335 19.25C12.8335 18.7437 13.2439 18.3333 13.7502 18.3333H14.6668C15.1731 18.3333 15.5835 18.7437 15.5835 19.25C15.5835 19.7562 15.1731 20.1667 14.6668 20.1667H13.7502C13.2439 20.1667 12.8335 19.7562 12.8335 19.25Z" fill="currentColor"/>
  </svg>
);

const RentIcon = ({ size = 20, className }: { size?: number | string, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M18.1409 3.86834C15.4276 1.16417 11.0276 1.16417 8.33259 3.86834C6.43509 5.7475 5.86676 8.45167 6.60009 10.835L2.29176 15.1433C1.98926 15.455 1.77843 16.0692 1.84259 16.5092L2.11759 18.5075C2.21843 19.1675 2.83259 19.7908 3.49259 19.8825L5.49093 20.1575C5.93093 20.2217 6.54509 20.02 6.85676 19.6992L7.60843 18.9475C7.79176 18.7733 7.79176 18.48 7.60843 18.2967L5.83009 16.5183C5.56426 16.2525 5.56426 15.8125 5.83009 15.5467C6.09593 15.2808 6.53593 15.2808 6.80176 15.5467L8.58926 17.3342C8.76343 17.5083 9.05676 17.5083 9.23093 17.3342L11.1743 15.4C13.5484 16.1425 16.2526 15.565 18.1409 13.6858C20.8451 10.9817 20.8451 6.5725 18.1409 3.86834ZM13.2918 11C12.0268 11 11.0001 9.97334 11.0001 8.70834C11.0001 7.44334 12.0268 6.41667 13.2918 6.41667C14.5568 6.41667 15.5834 7.44334 15.5834 8.70834C15.5834 9.97334 14.5568 11 13.2918 11Z" fill="currentColor"/>
  </svg>
);

const ApiIcon = ({ className }: { size?: number | string, className?: string }) => (
  // Контейнер строго 20x20
  <div className={cn("relative w-[20px] h-[20px] shrink-0", className)}>
    {/* Сама иконка 17.08x17.08 с позиционированием 1.46px */}
    <svg 
      style={{ 
        position: 'absolute', 
        top: '1.46px', 
        left: '1.46px', 
        width: '17.08px', 
        height: '17.08px' 
      }} 
      viewBox="0 0 18 18" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M8.58984 2.08616e-07C10.4153 -1.09076e-05 11.8493 -0.000118256 12.9688 0.150391C14.1159 0.304633 15.0261 0.62762 15.7412 1.34277C16.4564 2.05793 16.7794 2.96804 16.9336 4.11523C17.0841 5.23471 17.084 6.66865 17.084 8.49414V8.58984C17.084 10.4153 17.0841 11.8493 16.9336 12.9688C16.7794 14.1159 16.4564 15.0261 15.7412 15.7412C15.0261 16.4564 14.1159 16.7794 12.9688 16.9336C11.8493 17.0841 10.4153 17.084 8.58984 17.084H8.49414C6.66865 17.084 5.23471 17.0841 4.11523 16.9336C2.96804 16.7794 2.05793 16.4564 1.34277 15.7412C0.62762 15.0261 0.304633 14.1159 0.150391 12.9688C-0.000118256 11.8493 -1.09076e-05 10.4153 2.08616e-07 8.58984V8.49414C-1.09076e-05 6.66865 -0.000118256 5.23471 0.150391 4.11523C0.304633 2.96804 0.627619 2.05793 1.34277 1.34277C2.05793 0.627619 2.96804 0.304633 4.11523 0.150391C5.23471 -0.000118256 6.66865 -1.09076e-05 8.49414 2.08616e-07H8.58984ZM9.63867 5.25195C9.20224 5.10664 8.7306 5.342 8.58496 5.77832L6.91797 10.7783C6.77243 11.2149 7.00869 11.6875 7.44531 11.833C7.88191 11.9785 8.35346 11.7422 8.49902 11.3057L10.166 6.30566C10.3115 5.86906 10.0753 5.39749 9.63867 5.25195ZM5.83984 6.33105C5.53941 5.98266 5.01361 5.94393 4.66504 6.24414L3.64258 7.125C3.63233 7.13383 3.62165 7.14247 3.61133 7.15137C3.4238 7.31288 3.22479 7.48483 3.0791 7.64941C2.91438 7.83551 2.70899 8.13085 2.70898 8.54199C2.70898 8.95313 2.91438 9.24848 3.0791 9.43457C3.22479 9.59916 3.4238 9.7711 3.61133 9.93262C3.62166 9.94151 3.63233 9.95015 3.64258 9.95898L4.66504 10.8398C5.01361 11.1401 5.53941 11.1013 5.83984 10.7529C6.14032 10.4043 6.10154 9.87763 5.75293 9.57715L4.73047 8.69629C4.66266 8.63784 4.60433 8.58723 4.55273 8.54199C4.60433 8.49675 4.66266 8.44614 4.73047 8.3877L5.75293 7.50684C6.10154 7.20636 6.14032 6.67967 5.83984 6.33105ZM12.4189 6.24414C12.0704 5.94393 11.5446 5.98266 11.2441 6.33105C10.9437 6.67967 10.9824 7.20636 11.3311 7.50684L12.3535 8.3877C12.4213 8.44614 12.4797 8.49675 12.5312 8.54199C12.4797 8.58723 12.4213 8.63784 12.3535 8.69629L11.3311 9.57715C10.9824 9.87763 10.9437 10.4043 11.2441 10.7529C11.5446 11.1013 12.0704 11.1401 12.4189 10.8398L13.4414 9.95898C13.4517 9.95015 13.4623 9.94151 13.4727 9.93262C13.6602 9.7711 13.8592 9.59916 14.0049 9.43457C14.1696 9.24848 14.375 8.95313 14.375 8.54199C14.375 8.13085 14.1696 7.83551 14.0049 7.64941C13.8592 7.48483 13.6602 7.31288 13.4727 7.15137C13.4623 7.14247 13.4517 7.13383 13.4414 7.125L12.4189 6.24414Z" fill="currentColor"/>
    </svg>
  </div>
);
const TABS = [
  { label: 'Все', value: 'ALL' },
  { label: 'Платежная ссылка', value: 'PAY-LINK', icon: PayLinkIcon },
  { label: 'API', value: 'API', icon: ApiIcon },
  { label: 'QR-POS', value: 'QR-POS', icon: QrPosIcon },
  { label: 'QR-CODE', value: 'QR-CODE', icon: QrCodeIcon },
  { label: 'Заказы с залогом', value: 'DEPOSIT', icon: RentIcon }, // Изменили название и подставили иконку
];

function useDraggableScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const isDragged = useRef(false);

  const stopDragging = useCallback(() => {
    isDragging.current = false;
    if (ref.current) {
      ref.current.style.scrollSnapType = '';
      ref.current.style.cursor = 'grab';
    }
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging.current) stopDragging();
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [stopDragging]);

  const onMouseDown = (e: React.MouseEvent<T>) => {
    if (!ref.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    isDragging.current = true;
    isDragged.current = false;
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeftStart.current = ref.current.scrollLeft;
    
    ref.current.style.scrollSnapType = 'none';
    ref.current.style.cursor = 'grabbing';
  };

  const onMouseMove = (e: React.MouseEvent<T>) => {
    if (!isDragging.current || !ref.current) return;
    
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    
    if (Math.abs(walk) > 3) {
      isDragged.current = true;
      ref.current.scrollLeft = scrollLeftStart.current - walk;
    }
  };

  const onClickCapture = (e: React.MouseEvent<T>) => {
    if (isDragged.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return { ref, onMouseDown, onMouseLeave: stopDragging, onMouseUp: stopDragging, onMouseMove, onClickCapture };
}

export const MyInstrumentsSection = () => {
  const { instruments, filter, setFilter } = useInstrumentStore();
  const tabsScrollProps = useDraggableScroll<HTMLDivElement>();
  const cardsScrollProps = useDraggableScroll<HTMLDivElement>();

  const filteredInstruments = useMemo(() => {
    return instruments.filter(inst => filter === 'ALL' || inst.type === (filter as string));
  }, [instruments, filter]);

  const instrumentGroups = useMemo(() => {
    const displayInstruments = [
      ...filteredInstruments,
      ...filteredInstruments.map(item => ({ ...item, id: `${item.id}-copy1` })),
      ...filteredInstruments.map(item => ({ ...item, id: `${item.id}-copy2` })),
      ...filteredInstruments.map(item => ({ ...item, id: `${item.id}-copy3` }))
    ].slice(0, 12);

    const chunks = [];
    for (let i = 0; i < displayInstruments.length; i += 3) {
      chunks.push(displayInstruments.slice(i, i + 3));
    }
    return chunks;
  }, [filteredInstruments]);

  return (
    <section className="space-y-[16px] overflow-hidden relative -mx-[16px]">
      <div className="px-[16px] relative flex items-center">
        <h2 className="text-[24px] font-semibold leading-[32px] tracking-[-0.02em] text-black">
          Мои инструменты
        </h2>
      </div>

      {/* TABS */}
      <div 
        {...tabsScrollProps} 
        className="flex gap-[8px] overflow-x-auto px-[16px] pb-1 snap-x scroll-px-[16px] no-scrollbar cursor-grab active:cursor-grabbing touch-pan-x select-none"
      >
        {TABS.map((tab) => {
          const isActive = (filter as string) === tab.value;
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              className={cn(
                "flex items-center justify-center h-[36px] px-[12px] py-[8px] gap-[4px] rounded-full transition-all shrink-0 snap-start active:scale-95",
                // Новые шрифтовые стили для всех табов
                "text-[14px] font-medium leading-[20px] tracking-[-0.02em]", 
                isActive 
                  ? "bg-[#573DEB] text-white shadow-md border border-transparent" 
                  : "bg-white/50 text-black border-[1px] border-white/60 backdrop-blur-[12px]"
              )}
            >
              {Icon && <Icon size={20}  className="shrink-0" />}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CARDS */}
      <div 
        {...cardsScrollProps} 
        className="flex gap-[12px] overflow-x-auto snap-x snap-mandatory px-[16px] scroll-px-[16px] pb-2 no-scrollbar cursor-grab active:cursor-grabbing touch-pan-x select-none"
      >
        <AnimatePresence mode="popLayout">
          {instrumentGroups.map((group, groupIndex) => (
            <motion.div
              key={`group-${groupIndex}-${filter}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-[8px] shrink-0 snap-start w-[calc(100vw-110px)] max-w-[280px]"
            >
              {group.map((inst) => <InstrumentCard key={inst.id} data={inst} />)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    {/* 4. КНОПКА "Все инструменты (18)" */}
      <div className="px-[16px] flex justify-center">
        <button 
          className="flex items-center justify-center w-[171px] h-[36px] px-[12px] py-[8px] rounded-[1000px] backdrop-blur-[12px] active:scale-95 transition-transform cursor-pointer"
          style={{
            border: '1px solid transparent',
            background: `
              linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)) padding-box, 
              linear-gradient(93.5deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 50%, #FFFFFF 100%) border-box
            `
          }}
        >
          {/* Текстовый слой строго по параметрам Figma */}
          <span className="w-[147px] h-[20px] flex items-center justify-center text-[14px] font-medium leading-[20px] tracking-[-0.02em] text-[#000000] whitespace-nowrap">
            Все инструменты (18)
          </span>
        </button>
      </div>
    </section>
  );
};