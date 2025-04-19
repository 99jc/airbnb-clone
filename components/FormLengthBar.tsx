import clsx from "clsx";

const FormLengthBar = ({ className }: { className?: string }) => {
  return <div className={clsx("h-[44px] w-[1px] bg-black/10", className)} />;
};

export default FormLengthBar;
