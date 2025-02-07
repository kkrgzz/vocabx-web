import {
    BookOutlined,
    FireTwoTone,
    HighlightOutlined,
    InsuranceTwoTone,
    PlusOutlined,
    PushpinOutlined,
    ScheduleTwoTone,
    TagOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';

const icons = {
    wordsIcon: InsuranceTwoTone,
    newIcon: PlusOutlined,
    listIcon: UnorderedListOutlined,
    sentenceIcon: ScheduleTwoTone,
    practiceIcon: FireTwoTone,
    sentenceEditorIcon: HighlightOutlined,
    flashCardIcon: BookOutlined,
    vocabularyPracticeIcon: PushpinOutlined,
    sentencePracticeIcon: TagOutlined
}

const language = {
    id: 'language',
    title: 'Language 📖',
    type: 'group',
    url: '/language',
    children: [
        {
            id: 'words-and-translations',
            title: 'Words & Translations',
            type: 'collapse',
            url: '/words-and-translations',
            icon: icons.wordsIcon,
            children: [
                {
                    id: 'new-word',
                    title: 'New Word',
                    type: 'item',
                    url: '/word/new',
                    icon: icons.newIcon,
                },
                {
                    id: 'list-words',
                    title: 'Word List',
                    type: 'item',
                    url: '/word/list',
                    icon: icons.listIcon,
                }
            ]
        },
        {
            id: 'sentences',
            title: 'Sentences',
            type: 'collapse',
            url: '/sentences',
            icon: icons.sentenceIcon,
            children: [
                {
                    id: 'sentence-editor',
                    title: 'Editor',
                    type: 'item',
                    url: '/sentence/editor',
                    icon: icons.sentenceEditorIcon,
                }
            ]
        },
        {
            id: 'practice',
            title: 'Practice',
            type: 'collapse',
            url: '/practice',
            icon: icons.practiceIcon,
            children: [
                {
                    id: 'practice-flashcards',
                    title: 'Flashcards',
                    type: 'item',
                    url: '/practice/flashcards',
                    icon: icons.flashCardIcon,
                },
                {
                    id: 'practice-vocabulary',
                    title: 'Vocabulary',
                    type: 'item',
                    url: '/practice/vocabulary',
                    icon: icons.vocabularyPracticeIcon,
                },
                {
                    id: 'practice-sentence',
                    title: 'Sentence',
                    type: 'item',
                    url: '/practice/sentence',
                    icon: icons.sentencePracticeIcon,
                }
            ]
        }
    ]
};

export default language;