/// <reference types="react" />
declare type Props = {
    name?: string;
    hoverTitle?: string;
    types?: Array<string>;
    classes?: string;
    children?: JSX.Element;
    maxSize?: number;
    minSize?: number;
    file?: File | null;
    disabled?: boolean | false;
    onSizeError?: (arg0: string) => void;
    onTypeError?: (arg0: string) => void;
    onDrop?: (arg0: File) => void;
    onSelect?: (arg0: File) => void;
    handleChange?: (arg0: File) => void;
};
/**
 * File uploading main function
 * @param props - {name,
    hoverTitle,
    types,
    handleChange,
    classes,
    children,
    maxSize,
    minSize,
    file,
    onSizeError,
    onSelect,
    onDrop,
    onTypeError,
    disabled}
 * @returns JSX Element
 */
declare const FileUploader: React.FC<Props>;
export default FileUploader;
