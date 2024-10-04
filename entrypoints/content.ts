import PenSvg from '@/assets/svgs/pen.svg';
import SendSvg from '@/assets/svgs/send.svg'; 
import ResetSvg from '@/assets/svgs/reset.svg';
import ArrowDownSvg from '@/assets/svgs/arrow-down.svg';

import './content-style.css';

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    const getMessageInput = (): HTMLDivElement | null =>
      document.querySelector<HTMLDivElement>('.msg-form__contenteditable');

    /**
     * Check if the message input element exists
     * If it does, inject the AI button
     * If it doesn't, keep checking
     */
    const checkForMessageInput = () => {
      const messageContainer = getMessageInput();

      if (messageContainer) {
        injectAiButton(messageContainer.parentElement!);
        setupFocusEventListeners(messageContainer);
      } else {
        setTimeout(checkForMessageInput, 1000); // Keep checking every 1 second
      }
    };

    // Show/Hide the AI button on focus/blur
    const setupFocusEventListeners = (messageInput: HTMLDivElement) => {
      const aiButton = document.querySelector('.li-ai-button') as HTMLElement;

      messageInput.addEventListener('focus', () => {
        aiButton.style.display = 'flex';
      });

      messageInput.addEventListener('blur', () => {
        // Wait for the user interaction
        setTimeout(() => {
          aiButton.style.display = 'none'; 
        }, 200);
      });
    };

    /**
     * Inject the AI button
     * @param container The container element
     */
    const injectAiButton = (container: HTMLElement) => {
      const aiButton = createButtonElement(PenSvg, 'AI Button');
      aiButton.classList.add('li-ai-button');
      aiButton.style.display = 'none';

      aiButton.addEventListener('click', openAIModal);
      container.appendChild(aiButton);
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
      const messageInput = getMessageInput();
      if (messageInput) {
        messageInput.focus();
        messageInput.innerHTML = `<p>Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.</p>`;
        document.querySelector('.msg-form__placeholder')?.classList.remove('msg-form__placeholder'); // remove class top hide placeholder
        
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

    // Check if the message input element exists
    checkForMessageInput();
  },
});
