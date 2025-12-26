import { SVGProps } from "react";

export function Polygon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M18.75 2.5V6.25H17.5V15H18.75V18.75H15V17.5H6.25V18.75H2.5V15H3.75V10H5V15H6.25V16.25H15V15H16.25V6.25H15V5H10V3.75H15V2.5H18.75ZM3.75 16.25V17.5H5V16.25H3.75ZM16.25 16.25V17.5H17.5V16.25H16.25ZM5 1.25V3.75H7.5V5H5V7.5H3.75V5H1.25V3.75H3.75V1.25H5ZM16.25 3.75V5H17.5V3.75H16.25Z"
        fill="currentColor"
      />
    </svg>
  );
}
