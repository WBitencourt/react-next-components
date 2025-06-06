import { Meta, StoryObj } from "@storybook/react";
import { AccordionItemRootProps } from "@/components/accordion/item/root";
import Accordion from "../index";
import Content from './content/content.stories';
import SummaryRoot from './summary/root.stories';

const args: AccordionItemRootProps = {
  className: "text-green-500 dark:text-red-400",
  children: (
    <>
      <Accordion.Item.Summary.Root {...SummaryRoot.args}>
        { SummaryRoot.args?.children }
      </Accordion.Item.Summary.Root>

      <Accordion.Item.Content {...Content.args} >
        { Content.args?.children }
      </Accordion.Item.Content>
    </>
  ),
};

export default {
  title: "Components/Accordion/Item",
  component: Accordion.Item.Root,
  args,
  decorators: [
    (Story, props) => {
      return Story(props);
    },
  ],
} as Meta<AccordionItemRootProps>;

export const Root: StoryObj<AccordionItemRootProps> = (
  args: AccordionItemRootProps,
) => {
  return (
    <Accordion.Item.Root { ...args }>
      { args?.children }
    </Accordion.Item.Root>
  );
};

Root.args = { ...args };
