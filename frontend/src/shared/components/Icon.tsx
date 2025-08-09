/*

This component is a workaround for the issue with the react-icons package
Since react-icons relay a lot on actual react implementation, I had to create a wrapper.
This allows to use the react-icons package with the ft_react without need of restructuring a lot of code.

usage:
import { Icon } from "./Icons";
import { FaBeer } from "react-icons/fa";

<Icon icon={FaBeer} size={24} color="red" />

*/


import React from "react";

interface IconProps {
    icon: any;
    width?: number;
    height?: number;
    size?: number;
    color?: string;
    className?: string;
}

export const Icon = ({ icon, width, height, size, color, className }: IconProps) => {

    const iconElement = icon() as unknown as ReactElement;
    const viewBox = iconElement.props.attr.viewBox;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width || size || 16}
            height={height || size || 16}
            fill={color || "currentColor"}
            viewBox={viewBox}
            className={className}
        >
            {iconElement.children.map((child: any) => {
                return child;
            })}
        </svg>
    );
};