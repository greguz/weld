import { IComponent } from "../interfaces/IComponent";
import { IDirective } from "../interfaces/IDirective";
import { IView } from "../interfaces/IView";

export interface IComponentDirectiveOptions {
  node: HTMLElement;
  context: object;
  components: (name: string) => IComponent;
  view: (el: HTMLElement, data: object) => IView;
}

export function buildComponentDirective(options: IComponentDirectiveOptions): IDirective {
  // node present inside the DOM
  let currentNode: HTMLElement = options.node;

  // current component name
  let currentName: string;

  // bound component view
  let currentView: IView;

  // current component definition object
  let currentComponent: IComponent;

  // component context
  const context: any = options.context;

  // true if the component is not static
  const dynamic: boolean = options.node.tagName === "COMPONENT";

  /**
   * Parse the template string and get a component node
   */

  function parseTemplate(template: string): HTMLElement { // TODO this is not secure...
    const container: HTMLElement = document.createElement('div');
    container.innerHTML = template.trim();
    const componentNode = container.firstChild;
    container.removeChild(componentNode);
    return componentNode as HTMLElement;
  }

  /**
   * Unmount and stop current component data binding
   */

  function unmount(): void {
    // DOM and data-binding still ok
    if (currentComponent.unbind) {
      currentComponent.unbind.call(context, currentView);
    }

    // unbind the view
    currentView.unbind();

    // data-binding is dead
    if (currentComponent.detach) {
      currentComponent.detach.call(context, currentNode);
    }

    // DOM restored and data-binding not running
    if (currentComponent.destroy) {
      currentComponent.destroy.call(context);
    }

    // delete current component
    currentName = undefined;
    currentComponent = undefined;
    currentView = undefined;
  }

  /**
   * Mount a component and start data binding
   */

  function mount(name: string): void {
    // resolve component name
    const component: IComponent = options.components(name);

    // call creation hook
    if (component.create) {
      component.create.call(context);
    }

    // fetch template from component
    const template: string = component.template.call(context);

    // create the component HTML node
    const componentNode: HTMLElement = parseTemplate(template);

    // remove current node from DOM
    currentNode.parentElement.replaceChild(componentNode, currentNode);

    // call DOM attach hook
    if (component.attach) {
      component.attach.call(context, componentNode);
    }

    // create a new view for this component
    const view: IView = options.view(componentNode, context);

    // bound the view
    view.bind();

    // call last life hook
    if (component.bind) {
      component.bind.call(context, currentView);
    }

    // update status
    currentName = name;
    currentComponent = component;
    currentNode = componentNode;
    currentView = view;
  }

  /**
   * Triggered on directive creation
   */

  function bind(): void {
    if (!dynamic) {
      mount(options.node.tagName.toLowerCase());
    }
  }

  /**
   * Triggered when the model has changed
   */

  function routine(): void {
    if (dynamic) {
      const cName: string = context.is;
      if (currentName !== cName) {
        if (currentComponent) {
          unmount();
        }
        mount(cName);
      }
    } else {
      currentView.refresh();
    }
  }

  /**
   * Triggered when the directive is dying
   */

  function unbind(): void {
    unmount();
    currentNode.parentElement.replaceChild(options.node, currentNode);
    currentNode = options.node;
  }

  // return the directive
  return {
    bind,
    routine,
    unbind
  };
}
