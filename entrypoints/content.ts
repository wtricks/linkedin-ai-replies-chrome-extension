import PenSvg from '@/assets/svgs/pen.svg';
import SendSvg from '@/assets/svgs/send.svg'; 
import ResetSvg from '@/assets/svgs/reset.svg';
import ArrowDownSvg from '@/assets/svgs/arrow-down.svg';

import './content-style.css';

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    let currentActiveInput: HTMLDivElement | null = null;

    const getMessageInputs = (): NodeListOf<HTMLDivElement> =>
      document.querySelectorAll<HTMLDivElement>('.msg-form__contenteditable');

    /**
     * Check if the message input element exists
     * If it does, inject the AI button
     * If it doesn't, keep checking
     */
    const checkForMessageInputs = () => {
      const messageContainers = getMessageInputs();

      if (messageContainers) {
        messageContainers.forEach((container) => {
          if (container.parentElement?.querySelector('.li-ai-button')) {
            return
          }

          injectAiButton(container);
          setupFocusEventListeners(container);
        })
      }
    };

    // Show/Hide the AI button on focus/blur
    const setupFocusEventListeners = (messageInput: HTMLDivElement) => {
      const aiButton = messageInput.parentElement!.querySelector('.li-ai-button') as HTMLElement;

      messageInput.addEventListener('focus', () => {
        aiButton.style.display = 'flex';
      });

      messageInput.addEventListener('blur', () => {
        // Wait for the user interaction
        setTimeout(() => {
          aiButton.style.display = 'none'; 
        }, 500);
      });
    };

    /**
     * Inject the AI button
     * @param container The container element
     */
    const injectAiButton = (container: HTMLElement) => {
      const parentContainer = container.parentElement;
      const aiButton = createButtonElement(PenSvg, 'AI Button');
      aiButton.classList.add('li-ai-button');
      aiButton.style.display = container === document.activeElement ? 'flex' : 'none';

      aiButton.addEventListener('click', () => {
        // Open the AI modal
        openAIModal()

        // Set the current active input
        currentActiveInput = container as HTMLDivElement;
      });

      parentContainer!.appendChild(aiButton);
    };

    /**
     * Create a button element
     * @param iconSrc icon source path
     * @param altText alt text
     * @returns 
     */
    const createButtonElement = (iconSrc: string, altText: string) => {
      const button = document.createElement('button');
      button.innerHTML = `<img src="${iconSrc}" alt="${altText}" role="button" />`;
      button.type = 'button';
      return button;
    };

    /**
     * Open the AI modal
     */
    const openAIModal = () => {
      console.log('Open AI modal!');
      const modalWrapper = document.createElement('div');
      modalWrapper.classList.add('li-ai-modal-wrapper');

      const modal = document.createElement('div');
      modal.classList.add('li-ai-modal');

      modal.innerHTML = `
        <ul class="li-ai-modal-list"></ul>
        <input type="text" class="li-ai-input" placeholder="Your prompt" style="height: 40px" />
        <div class="li-ai-modal-footer">
          <button type="button" class="li-ai-button generate-btn">
            <img src="${SendSvg}" alt="Generate Button" /> <span>Generate</span>
          </button>
        </div>
      `;

      modalWrapper.appendChild(modal);
      document.body.appendChild(modalWrapper);

      // Show modal
      setTimeout(() => {
        modalWrapper.style.opacity = '1';
        modal.style.transform = 'scale(1)';
      }, 10);

      const generateButton = modal.querySelector('.generate-btn') as HTMLButtonElement;
      generateButton.addEventListener('click', () => handleGenerate(modal, generateButton));
    };

    /**
     * Handle the generate button click
     * @param modal The modal element
     * @param generateButton The generate button element
     * @returns 
     */
    const handleGenerate = (modal: HTMLDivElement, generateButton: HTMLButtonElement) => {
      const inputElement = modal.querySelector('.li-ai-input') as HTMLInputElement;
      const modalList = modal.querySelector('.li-ai-modal-list') as HTMLUListElement;

      if (inputElement.value.trim() === '') return;

      // Add user input to the list
      const userItem = document.createElement('li');
      userItem.classList.add('li-ai-modal-item');
      userItem.textContent = inputElement.value;
      modalList.appendChild(userItem);

      // Add AI response to the list after some delay (mimic API call)
      setTimeout(() => {
        const aiResponseItem = document.createElement('li');
        aiResponseItem.classList.add('li-ai-modal-item', 'ai-reply');
        aiResponseItem.textContent = 'Thank you for the opportunity! If you have any more questions or if there\'s anything else I can help you with, feel free to ask.';
        modalList.appendChild(aiResponseItem);
        
        // Change generate button to "Regenerate" and show Insert button
        generateButton.innerHTML = `<img src="${ResetSvg}" alt="Regenerate Button" /> <span>Regenerate</span>`;
        showInsertButton(modal, generateButton);
      }, 1000);
    }

    /**
     * Show insert button
     * @param modal The modal element
     * @param generateButton The generate button element
     */
    const showInsertButton = (modal: HTMLDivElement, generateButton: HTMLButtonElement) => {
      const insertBtn = createButtonElement(ArrowDownSvg, 'Insert Button');
      insertBtn.innerHTML = `<img src="${ArrowDownSvg}" /> <span>Insert</span>`;
      insertBtn.classList.add('insert-btn', 'li-ai-button');
      insertBtn.addEventListener('click', insertAiResponse);
      generateButton.parentElement?.insertBefore(insertBtn, generateButton);
    };

    /**
     * Insert AI response
     */
    const insertAiResponse = () => {
      if (currentActiveInput) {
        currentActiveInput.focus();
        currentActiveInput.innerHTML = `<p>Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.</p>`;
        currentActiveInput.parentElement!.querySelector('.msg-form__placeholder')?.classList.remove('msg-form__placeholder'); // remove class top hide placeholder
        currentActiveInput = null;

        closeModal(document.querySelector('.li-ai-modal-wrapper')!);
      }
    };

    /**
     * Close the modal
     * @param modalWrapper The modal wrapper element
     */
    const closeModal = (modalWrapper: HTMLElement) => {
      modalWrapper.remove();
    };

    // we need a better way to inject the button
    // we can use 'MutationObserver' to check if the message input element exists
    // but for now I'm just checking ai-button element, if it is not exists, we can inject the button
    setInterval(() => {
      checkForMessageInputs();
    }, 1000);
  },
});
