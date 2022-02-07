import React, {ReactNode, useEffect, useState} from 'react';
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";

type ModalProps = {
    isOpen: boolean,
    children: ReactNode,
    onClose: () => void,
    title?: string,
    iconClassName?: string,
    bgClassName?: string,
    contentClassName?: string,
    maxWidth?: number | string,
    minHeight?: number | string,
    maxHeight?: number | string,
};

const ModalContainer = styled.div`
  section {
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  @keyframes expand {
    0% { height: 0; opacity: 0.5; overflow: hidden; }
    35% { height: 35%; opacity: 0.75; overflow: hidden}
    100% { opacity: 1; height: auto; overflow: unset }
  }

  @keyframes crunch {
    0%  { opacity: 1 }
    25% { height: 50%; overflow: hidden }
    50% { height: 0; opacity: 0; overflow: hidden }
    100% { height: 0; opacity: 0; overflow: hidden }
  }

  .animate-fade-in {
    animation: 100ms expand linear;
  }

  @keyframes bg-fadeout {
    0%  { background: rgba(0, 0, 0, 0.5)!important; --tw-backdrop-blur: 1px!important; }
    50% { background: rgba(0, 0, 0, 0.25)!important; opacity: 0.5; --tw-backdrop-blur: 0!important;}
    100% { background: rgba(0, 0, 0, 0)!important; opacity: 0; height: 0; }
  }

  .animate-fade-out {
    animation: 350ms bg-fadeout ease-out;
  }

  .animate-crunch {
    animation: 500ms crunch ease-out;
  }
`;

const useDelayUnmount = (isMounted: boolean, delayTime: number) => {

    const [ shouldRender, setShouldRender ] = useState(false);

    useEffect(() => {
        let timeoutId: any;
        if (isMounted && !shouldRender) {
            setShouldRender(true);
        }
        else if(!isMounted && shouldRender) {
            timeoutId = setTimeout(
                () => setShouldRender(false),
                delayTime
            );
        }
        return () => clearTimeout(timeoutId);
    }, [isMounted, delayTime, shouldRender]);
    return shouldRender;

}

const Modal = ({
   isOpen, children, onClose, title, iconClassName, bgClassName = '', contentClassName = '',
   maxWidth = 720, minHeight, maxHeight,
}: ModalProps) => {

    const { background, color } = useTheme();
    const shouldRenderChild = useDelayUnmount(isOpen, 300);

    useEffect(() => {
        if (shouldRenderChild) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = null;
    }, [shouldRenderChild]);

    return shouldRenderChild ? (
        <ModalContainer>
            <section
                className={`fixed top-0 left-0 w-screen h-screen flex justify-center items-end sm:items-center backdrop-filter backdrop-blur-sm ${!isOpen ? 'animate-fade-out' : ''}`}
                onClick={onClose}
            >
                <div
                    className={`${bgClassName} relative rounded-t-lg sm:rounded-b-lg shadow-lg sm:w-auto w-full animate-fade-in ${!isOpen ? 'animate-crunch' : ''}`}
                    style={{ background, color }}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="absolute top-0 right-0 pr-2">
                        <button title="close" className="font-mono outline-none font-bold text-2xl" onClick={onClose}>x</button>
                    </div>
                    <div
                        className={`${contentClassName} overflow-y-auto`}
                        style={{ maxWidth, minHeight, maxHeight }}
                    >
                        {title && <h2 className="text-2xl font-semibold mb-3">
                            {iconClassName && <i className={iconClassName} />}
                            {title}
                        </h2>}
                        {children}
                    </div>
                </div>
            </section>
        </ModalContainer>
    ) : <div />;
};

export default Modal;