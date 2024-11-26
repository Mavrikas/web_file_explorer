import { Data } from '@/store/types';

export const dummyData: Data[] = [
    {
        id: '2',
        name: 'public',
        path: 'public',
        content: [
            {
                id: '4',
                name: 'coffee.png',
                path: 'public\\coffee.png',
                content:
                    'https://icons.iconarchive.com/icons/iconarchive/fat-sugar-food/512/Drink-Coffee-icon.png',
            },
        ],
    },
    {
        id: '6',
        name: 'server',
        path: 'server',
        content: [
            {
                id: '7',
                name: 'server1.json',
                path: 'server\\server1.json',
                content: '{"test":"test"}',
            },
        ],
    },
    {
        id: '9',
        name: 'src',
        path: 'src',
        content: [
            {
                id: '13',
                name: 'src1.txt',
                path: 'src\\src1.txt',
                content: 'test',
            },
        ],
    },
];
