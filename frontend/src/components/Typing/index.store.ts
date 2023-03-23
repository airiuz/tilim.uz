import create from 'zustand';

type ITyping = {
    show: boolean;
    passed: boolean;
    setPassed: (show :boolean) => void;
    setShow: (show :boolean) => void;
};

export const useShowStore = create<ITyping>((set) => ({
    show: false,
    setShow: (show) => {
        return set({show})
    },
    passed: false,
    setPassed: (show) => {
        return set({show})
    },
}));