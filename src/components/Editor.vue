<template>
  <div>
    <v-card class="pa-0">
      <v-card class="px-10" color="#7C7C7C4F">
        <v-row>
          <v-col>
            <v-btn-toggle multiple dense>
              <v-btn @click="editor.commands.toggleBold()">
                <v-icon>la-bold</v-icon>
              </v-btn>
              <v-btn @click="editor.commands.toggleItalic()">
                <v-icon>la-italic</v-icon>
              </v-btn>
              <v-btn @click="editor.commands.toggleUnderline()">
                <v-icon>la-underline</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col>
            <v-btn-toggle dense>
              <v-btn
                @click="editor.chain().focus().setTextAlign('right').run()"
              >
                <v-icon>la-align-right</v-icon>
              </v-btn>
              <v-btn
                @click="editor.chain().focus().setTextAlign('center').run()"
              >
                <v-icon>la-align-center</v-icon>
              </v-btn>
              <v-btn @click="editor.chain().focus().setTextAlign('left').run()">
                <v-icon>la-align-left</v-icon>
              </v-btn>
              <v-btn
                @click="editor.chain().focus().setTextAlign('justify').run()"
              >
                <v-icon>la-align-justify</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col>
            <v-btn-toggle dense>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on">
                    <v-icon>la-palette</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    @click="editor.chain().focus().setColor(item).run()"
                    dense
                    v-for="(item, index) in colors"
                    :key="index"
                  >
                    <v-list-item-title>
                      <v-icon :color="item"> mdi-circle </v-icon>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on"> حجم الخط </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    @click="
                      editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: index + 1 })
                        .run()
                    "
                    dense
                    v-for="(item, index) in fontSizes"
                    :key="index"
                  >
                    <v-list-item-title>
                      {{ item }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn-toggle>
          </v-col>
          <v-col>
            <v-btn-toggle dense>
              <v-btn
                @click="
                  fileEmbed = true;
                  selectImage();
                "
              >
                <v-icon>la-image</v-icon>
              </v-btn>
              <v-btn @click="addVideoModal = true">
                <v-icon>la-youtube</v-icon>
              </v-btn>
              <v-btn
                @click="
                  fileEmbed = false;
                  selectImage();
                "
              >
                <v-icon>la-file-pdf</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col>
            <v-btn-toggle dense>
              <v-btn @click="addAlertModal = true">
                <v-icon>la-magic</v-icon>
              </v-btn>
              <v-btn @click="addLinkModal = true">
                <v-icon>la-link</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-card>

      <div class="pa-5">
        <editor-content :editor="editor" />
      </div>
    </v-card>

    <vue-bottom-sheet max-width="70%" max-height="90%" ref="uploadsBottomSheet">
      <Uploads :isDialog="true" @clicked="setImagePath" />
    </vue-bottom-sheet>

    <v-dialog max-width="500" v-model="addVideoModal">
      <v-card>
        <v-card-title>اضافة فيديو يوتيوب</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="youtubeLink"
            outlined
            label="الرابط"
            append-icon="mdi-link"
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn @click="addVideoLink" color="success">اضافة</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog max-width="500" v-model="addAlertModal">
      <v-card>
        <v-card-title>اضافة نص</v-card-title>
        <v-card-text>
          <v-checkbox
            true-value="d-block"
            false-value="d-inline"
            v-model="alertType"
            label="اتساع كامل"
          ></v-checkbox>
          <v-row>
            <v-col :cols="alertType == 'd-block' ? 12 : 6">
              <v-alert
                @click="addAlert('success')"
                color="success"
                dark
                class="text-center"
                >TEXT</v-alert
              >
            </v-col>
            <v-col :cols="alertType == 'd-block' ? 12 : 6">
              <v-alert
                @click="addAlert('primary')"
                color="primary"
                dark
                class="text-center"
                >TEXT</v-alert
              >
            </v-col>
            <v-col :cols="alertType == 'd-block' ? 12 : 6">
              <v-alert
                @click="addAlert('indigo')"
                color="indigo"
                dark
                class="text-center"
                >TEXT</v-alert
              >
            </v-col>
            <v-col :cols="alertType == 'd-block' ? 12 : 6">
              <v-alert
                @click="addAlert('warning')"
                color="warning"
                dark
                class="text-center"
                >TEXT</v-alert
              >
            </v-col>
            <v-col :cols="alertType == 'd-block' ? 12 : 6">
              <v-alert
                @click="addAlert('error')"
                color="error"
                dark
                class="text-center"
                >TEXT</v-alert
              >
            </v-col>
            <v-col :cols="alertType == 'd-block' ? 12 : 6">
              <v-alert
                @click="addAlert('dark')"
                color="dark"
                dark
                class="text-center"
                >TEXT</v-alert
              >
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog max-width="500" v-model="addLinkModal">
      <v-card>
        <v-card-title>اضافة رابط</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="link"
            outlined
            label="الرابط"
            append-icon="mdi-link"
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn @click="addButton('primary')" color="success">اضافة</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <bubble-menu
      class="bubble-menu"
      :tippy-options="{ animation: true }"
      :editor="editor"
      v-if="editor"
      v-show="editor.isActive('custom-image')"
    >
      <v-btn
        @click="editor.chain().focus().setImage({ size: 'small' }).run()"
        :class="{
          'is-active': editor.isActive('custom-image', {
            size: 'small',
          }),
        }"
      >
        Small
      </v-btn>
      <v-btn
        @click="editor.chain().focus().setImage({ size: 'medium' }).run()"
        :class="{
          'is-active': editor.isActive('custom-image', {
            size: 'medium',
          }),
        }"
      >
        Medium
      </v-btn>
      <v-btn
        @click="editor.chain().focus().setImage({ size: 'large' }).run()"
        :class="{
          'is-active': editor.isActive('custom-image', {
            size: 'large',
          }),
        }"
      >
        Large
      </v-btn>
    </bubble-menu>

    <bubble-menu
      class="bubble-menu"
      :tippy-options="{ animation: true }"
      :editor="editor"
      v-if="editor"
      v-show="editor.can().deleteTable()"
    >
      <v-btn small dark @click="editor.chain().focus().deleteTable().run()">
        حذف الجدول
      </v-btn>
      <v-btn small dark @click="editor.chain().focus().deleteRow().run()">
        حذف السطر
      </v-btn>
      <v-btn small dark @click="editor.chain().focus().addRowAfter().run()">
        اضافة سطر جديد
      </v-btn>
    </bubble-menu>
  </div>
</template>

<script>
import Uploads from "./Upload.vue";
import { Editor, EditorContent, BubbleMenu } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Video from "../plugins/video";
import vAlert from "../plugins/vAlert";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import Button from "../plugins/vButton";
import vImage from "../plugins/vImage";

export default {
  components: {
    EditorContent,
    Uploads,
    BubbleMenu,
  },

  props: {
    value: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      editor: null,
      colors: [
        "#000000",
        "#FF0000",
        "#FFBB00",
        "#0084FF",
        "#10BE00",
        "#C300FF",
        "#7E0054",
        "#5E009C",
        "#750037",
        "#FFA600",
      ],
      fontSizes: ["H1", "H2", "H3", "H4", "H5", "H6"],
      addVideoModal: false,
      addAlertModal: false,
      addLinkModal: false,
      fileEmbed: true,
      alertType: "d-block",
      link: "",
      youtubeLink: "",
    };
  },

  methods: {
    selectImage() {
      this.$refs.uploadsBottomSheet.open();
    },
    setImagePath(path) {
      this.$refs.uploadsBottomSheet.close();
      if (this.fileEmbed) {
        this.editor.commands.setImage({ src: this.$baseUrl + path });
      } else {
        this.editor.commands.toggleLink({
          href: this.$baseUrl + path,
          target: "_blank",
        });
      }
    },
    addYoutubeVideo(link) {
      const url = "https://www.youtube.com/embed/" + this.youtube_parser(link);
      this.editor.commands.insertContent(
        `<iframe width="560" height="315" src="${url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
      );
    },
    youtube_parser(url) {
      var regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = url.match(regExp);
      return match && match[7].length == 11 ? match[7] : false;
    },
    addVideoLink() {
      this.addYoutubeVideo(this.youtubeLink);
      this.youtubeLink = "";
      this.addVideoModal = false;
    },
    addAlert(color = "success") {
      this.editor.commands.insertContent(
        `<p class="v-alert ${this.alertType} v-sheet v-sheet--shaped theme--dark ${color} text-center text-h5">TEXT HERE</p>`
      );
      this.addAlertModal = false;
    },
    addButton() {
      this.editor.commands.toggleLink({
        href: `${this.link}`,
        target: "_blank",
      });
      this.link = "";
      this.addLinkModal = false;
    },
  },
  watch: {
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value;

      // JSON
      // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

      if (isSame) {
        return;
      }

      this.editor.commands.setContent(value, false);
    },
  },

  mounted() {
    this.editor = new Editor({
      content: this.value,
      extensions: [
        StarterKit,
        Document,
        Paragraph,
        Underline,
        Bold,
        Link.configure({
          autolink: true,
          openOnClick: false,
        }),
        Text,
        Video.configure({
          inline: true,
        }),
        vAlert,
        Button,
        TextStyle,
        Heading.configure({
          levels: [1, 2, 3, 4, 5, 6],
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Color.configure({
          types: ["textStyle"],
        }),

        Table.configure({
          HTMLAttributes: {
            class: "customTable",
          },
          resizable: true,
        }),
        TableRow,
        TableCell,
        TableHeader,
        vImage,
      ],
      onUpdate: () => {
        // HTML
        this.$emit("input", this.editor.getHTML());

        // JSON
        // this.$emit('input', this.editor.getJSON())
      },
    });
  },

  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  img {
    width: 100%;
    height: auto;
    display: block;
    margin-left: auto;
    margin-right: auto;
    &.ProseMirror-selectednode {
      outline: 3px solid #68cef8;
    }
  }

  .custom-image-float-none {
    float: none;
  }
  .custom-image-float-left {
    float: left;
  }
  .custom-image-float-right {
    float: right;
  }
}
</style>