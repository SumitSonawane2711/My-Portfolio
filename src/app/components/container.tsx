import React from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
	children: React.ReactNode;
	className?: string;
};

const Container: React.FC<ContainerProps> = ({ children, className }) => {
	return (
		<div className={cn("mx-auto w-full max-w-4xl bg-white p-4 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 md:px-18", className)}>
			{children}
		</div>
	);
};

export default Container;
