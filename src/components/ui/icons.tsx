import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export function LeafIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Z" />
      <path d="M5 19c3-5 7-9 11-11" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9.5V20h12V9.5" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5" />
      <path d="M15.5 5.4a3.25 3.25 0 0 1 0 5.2" />
      <path d="M17.5 14.9c1.6.7 2.6 2 3 4.1" />
    </svg>
  );
}

export function EnvelopeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </svg>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M18 6l-1.4 1.4M7.4 16.6 6 18M18 18l-1.4-1.4M7.4 7.4 6 6" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.2 2.4 2.4 4.6-4.8" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function XCircleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </svg>
  );
}

export function WarningIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4 2.8 19.5h18.4L12 4Z" />
      <path d="M12 10v4.2M12 17.2v.1" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8v.1" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 6.5h15M9.5 6V4.5h5V6M6.5 6.5 7.3 20h9.4l.8-13.5" />
      <path d="M10 10.5v6M14 10.5v6" />
    </svg>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.5 5.5 18.5 9.5 8.5 19.5 4 20l.5-4.5 10-10Z" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
      <path d="M15.5 5.5v-1h-11v11h1" />
    </svg>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M13.5 5.5h5v5M18.5 5.5 11 13M18.5 13.5v5h-13v-13h5" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.5 6.5 9 12l5.5 5.5" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m9.5 6.5 5.5 5.5-5.5 5.5" />
    </svg>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.5 4.5h-10v15h10M10 12h10M17 8.5l3.5 3.5-3.5 3.5" />
    </svg>
  );
}

export function ImageIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m5 17.5 4.5-4.5 3 3 3.5-3.5 3 3" />
    </svg>
  );
}

export function PineIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={2}>
      <path d="M11.9989 22V19M16.9988 14L19.9988 17.3C20.1358 17.4398 20.2288 17.6167 20.2662 17.8088C20.3037 18.001 20.2839 18.1998 20.2094 18.3808C20.1349 18.5618 20.0088 18.717 19.847 18.8271C19.6851 18.9371 19.4945 18.9973 19.2988 19H4.69875C4.50303 18.9973 4.31241 18.9371 4.15054 18.8271C3.98867 18.717 3.86265 18.5618 3.78812 18.3808C3.71359 18.1998 3.69382 18.001 3.73126 17.8088C3.76871 17.6167 3.86171 17.4398 3.99875 17.3L6.99875 14H6.69875C6.50303 13.9973 6.31241 13.9371 6.15054 13.8271C5.98867 13.717 5.86265 13.5619 5.78812 13.3808C5.71359 13.1998 5.69382 13.001 5.73126 12.8088C5.76871 12.6167 5.86171 12.4398 5.99875 12.3L8.99875 9H8.79875C8.5945 9.01843 8.38952 8.97361 8.2116 8.87162C8.03368 8.76963 7.89141 8.6154 7.80409 8.42984C7.71677 8.24428 7.68861 8.03636 7.72343 7.83425C7.75825 7.63215 7.85437 7.44564 7.99875 7.3L11.9988 3L15.9988 7.3C16.1431 7.44564 16.2393 7.63215 16.2741 7.83425C16.3089 8.03636 16.2807 8.24428 16.1934 8.42984C16.1061 8.6154 15.9638 8.76963 15.7859 8.87162C15.608 8.97361 15.403 9.01843 15.1988 9H14.9988L17.9988 12.3C18.1358 12.4398 18.2288 12.6167 18.2662 12.8088C18.3037 13.001 18.2839 13.1998 18.2094 13.3808C18.1349 13.5619 18.0088 13.717 17.847 13.8271C17.6851 13.9371 17.4945 13.9973 17.2988 14H16.9988Z" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg {...base({ ...props, viewBox: "0 0 18 18" })} strokeWidth={2}>
      <path d="M15.0005 1.50086V4.50075M16.5006 3.00081H13.5004M8.26269 2.11167C8.29483 1.93963 8.38613 1.78425 8.52078 1.67243C8.65544 1.56061 8.82496 1.4994 9 1.4994C9.17504 1.4994 9.34456 1.56061 9.47922 1.67243C9.61387 1.78425 9.70517 1.93963 9.73731 2.11167L10.5256 6.28001C10.5816 6.57636 10.7256 6.84895 10.9389 7.0622C11.1522 7.27546 11.4248 7.41948 11.7212 7.47546L15.8901 8.26368C16.0621 8.29581 16.2175 8.38711 16.3293 8.52174C16.4412 8.65638 16.5024 8.82588 16.5024 9.0009C16.5024 9.17592 16.4412 9.34542 16.3293 9.48006C16.2175 9.6147 16.0621 9.70599 15.8901 9.73812L11.7212 10.5263C11.4248 10.5823 11.1522 10.7263 10.9389 10.9396C10.7256 11.1529 10.5816 11.4254 10.5256 11.7218L9.73731 15.8901C9.70517 16.0622 9.61387 16.2176 9.47922 16.3294C9.34456 16.4412 9.17504 16.5024 9 16.5024C8.82496 16.5024 8.65544 16.4412 8.52078 16.3294C8.38613 16.2176 8.29483 16.0622 8.26269 15.8901L7.47438 11.7218C7.41839 11.4254 7.27435 11.1529 7.06107 10.9396C6.84779 10.7263 6.57517 10.5823 6.27878 10.5263L2.10994 9.73812C1.93788 9.70599 1.78248 9.6147 1.67065 9.48006C1.55882 9.34542 1.4976 9.17592 1.4976 9.0009C1.4976 8.82588 1.55882 8.65638 1.67065 8.52174C1.78248 8.38711 1.93788 8.29581 2.10994 8.26368L6.27878 7.47546C6.57517 7.41948 6.84779 7.27546 7.06107 7.0622C7.27435 6.84895 7.41839 6.57636 7.47438 6.28001L8.26269 2.11167ZM4.49967 15.0003C4.49967 15.8287 3.82805 16.5003 2.99955 16.5003C2.17106 16.5003 1.49943 15.8287 1.49943 15.0003C1.49943 14.1719 2.17106 13.5004 2.99955 13.5004C3.82805 13.5004 4.49967 14.1719 4.49967 15.0003Z" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />
    </svg>
  );
}
