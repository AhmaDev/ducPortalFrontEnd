import { Link } from '@tiptap/extension-link'

export default Link.extend({
    addOptions() {
        return {
            exitOnTripleEnter: true,
            exitOnArrowDown: true,
        }
    },
    addAttributes() {
        return {
            class: '*',
            href: '*'
        }
    },

    parseHTML() {
        return [
            {
                tag: 'a'
            }
        ]
    },

    addKeyboardShortcuts() {
        return {

            // remove code block when at start of document or code block is empty
            Backspace: () => {
                const { empty, $anchor } = this.editor.state.selection
                const isAtStart = $anchor.pos === 1

                if (!empty || $anchor.parent.type.name !== this.name) {
                    return false
                }

                if (isAtStart || !$anchor.parent.textContent.length) {
                    return this.editor.commands.clearNodes()
                }

                return false
            },

            // exit node on triple enter
            Enter: ({ editor }) => {
                if (!this.options.exitOnTripleEnter) {
                    return false
                }

                const { state } = editor
                const { selection } = state
                const { $from, empty } = selection

                if (!empty || $from.parent.type !== this.type) {
                    return false
                }

                const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2
                const endsWithDoubleNewline = $from.parent.textContent.endsWith('\n\n')

                if (!isAtEnd || !endsWithDoubleNewline) {
                    return false
                }

                return editor
                    .chain()
                    .command(({ tr }) => {
                        tr.delete($from.pos - 2, $from.pos)

                        return true
                    })
                    .exitCode()
                    .run()
            },

            // exit node on arrow down
            ArrowDown: ({ editor }) => {
                if (!this.options.exitOnArrowDown) {
                    return false
                }

                const { state } = editor
                const { selection, doc } = state
                const { $from, empty } = selection

                if (!empty || $from.parent.type !== this.type) {
                    return false
                }

                const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2

                if (!isAtEnd) {
                    return false
                }

                const after = $from.after()

                if (after === undefined) {
                    return false
                }

                const nodeAfter = doc.nodeAt(after)

                if (nodeAfter) {
                    return false
                }

                return editor.commands.exitCode()
            },
        }
    },
});