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

    const checkForMessageInput = () => {
      const messageContainer = getMessageInput();

      if (messageContainer) {
        injectAiButton(messageContainer.parentElement!);
      } else {
        setTimeout(checkForMessageInput, 1000); // Keep checking every 1 second
      }
    };

    const injectAiButton = (container: HTMLElement) => {
      const aiButton = createButtonElement(PenSvg, 'AI Button');
      aiButton.classList.add('li-ai-button');
      aiButton.addEventListener('click', openAIModal);
      container.appendChild(aiButton);
    };

    const createButtonElement = (iconSrc: string, altText: string) => {
      const button = document.createElement('button');
      button.innerHTML = `<img src="${iconSrc}" alt="${altText}" role="button" />`;
      button.type = 'button';
      return button;
    };

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

    const handleGenerate = (modal: HTMLDivElement, generateButton: HTMLButtonElement) => {
      const inputElement = modal.querySelector('.li-ai-input') as HTMLInputElement;
      const modalList = modal.querySelector('.li-ai-modal-list') as HTMLUListElement;

      if (inputElement.value.trim() === '') return;

      // Add user input to the list
      const userItem = document.createElement('li');
      userItem.classList.add('li-ai-modal-item');
      userItem.textContent = inputElement.value;
      modalList.appendChild(userItem);

      // Add AI response to the list after some delay (simulate async response)
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

    const showInsertButton = (modal: HTMLDivElement, generateButton: HTMLButtonElement) => {
      const insertBtn = createButtonElement(ArrowDownSvg, 'Insert Button');
      insertBtn.innerHTML = `<img src="${ArrowDownSvg}" /> <span>Insert</span>`;
      insertBtn.classList.add('insert-btn', 'li-ai-button');
      insertBtn.addEventListener('click', insertAiResponse);
      generateButton.parentElement?.insertBefore(insertBtn, generateButton);
    };

    const insertAiResponse = () => {
      const messageInput = getMessageInput();
      if (messageInput) {
        messageInput.focus();
        messageInput.innerHTML = `<p>Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.</p>`;
        closeModal(document.querySelector('.li-ai-modal-wrapper')!);
      }
    };

    const closeModal = (modalWrapper: HTMLElement) => {
      modalWrapper.remove();
    };

    checkForMessageInput();
  },
});
