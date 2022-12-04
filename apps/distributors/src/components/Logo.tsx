import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="https://ekosystem.wroc.pl/wp-content/themes/ekosystem/assets/svg/logo-ekosystem.svg"
      height={83}
      width={300}
      alt="EkoSystem logo"
      className="h-full w-full"
    />
  );
}
