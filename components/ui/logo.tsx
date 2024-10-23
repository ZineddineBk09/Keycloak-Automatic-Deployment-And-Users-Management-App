import dynamic from "next/dynamic";
const Link = dynamic(() => import("next/link"));
const Image = dynamic(() => import("next/image"));

const Logo = ({
  className = "",
  white = false,
}: {
  className?: string;
  white?: boolean;
}) => {
  return (
    <Link
      href="/"
      prefetch={true}
      passHref
      className={`w-26 relative ${className}`}
    >
      <Image
        src={white ? "/images/logo-white-no-bg.png" : "/images/logo-no-bg.png"}
        alt="CTS"
        width={150}
        height={150}
        className="h-16 w-56 rounded-lg object-contain mr-10"
      />
    </Link>
  );
};

export default Logo;
