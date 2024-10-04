import PenSvg from '@/assets/svgs/pen.svg';
import SendSvg from '@/assets/svgs/send.svg'; 
import ResetSvg from '@/assets/svgs/reset.svg';
import ArrowDownSvg from '@/assets/svgs/arrow-down.svg';
import './content-style.css';

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    let activeInput: HTMLDivElement | null = null;

    const selectMessageInputs = (): NodeListOf<HTMLDivElement> =>
      document.querySelectorAll<HTMLDivElement>('.msg-form__contenteditable');

    const checkForMessageInputs = () => {
      const messageContainers = selectMessageInputs();

      messageContainers.forEach((container) => {
        if (!container.parentElement?.querySelector('.li-ai-button')) {
          injectAiButton(container);
          toggleAiButtonVisibility(container);
        }
      });
    };

    const toggleAiButtonVisibility = (inputElement: HTMLDivElement) => {
      const aiButton = inputElement.parentElement!.querySelector('.li-ai-button') as HTMLElement;

      inputElement.addEventListener('focus', () => aiButton.style.display = 'flex');
      inputElement.addEventListener('blur', () => setTimeout(() => aiButton.style.display = 'none', 500));
    };

    const injectAiButton = (inputContainer: HTMLElement) => {
      const aiButton = createButton(PenSvg, 'AI Button', 'li-ai-button');
      aiButton.style.display = inputContainer === document.activeElement ? 'flex' : 'none';

      aiButton.addEventListener('click', () => {
        openAIModal();
        activeInput = inputContainer as HTMLDivElement;
      });

      inputContainer.parentElement!.appendChild(aiButton);
    };

    const createButton = (iconSrc: string, altText: string, additionalClasses = ''): HTMLButtonElement => {
      const button = document.createElement('button');
      button.innerHTML = `<img src="${iconSrc}" alt="${altText}" role="button" />`;
      button.type = 'button';
      if (additionalClasses) button.classList.add(...additionalClasses.split(' '));
      return button;
    };

    const openAIModal = () => {
      const modalWrapper = createModalWrapper();
      const modalContent = createModalContent();
      modalWrapper.appendChild(modalContent);
      document.body.appendChild(modalWrapper);

      showModal(modalWrapper, modalContent);

      const generateButton = modalContent.querySelector('.generate-btn') as HTMLButtonElement;
      generateButton.addEventListener('click', () => {
        // check if aleady added response
        const aiResponseItem = modalContent.querySelector('.ai-reply') as HTMLElement;
        if (aiResponseItem) {
          aiResponseItem.remove();

          const modalList = modalContent.querySelector('.li-ai-modal-list') as HTMLUListElement;
          setTimeout(() => appendAIResponse(modalList, generateButton), 1000); // mimic AI response
          return
        }

        handleGenerate(modalContent, generateButton);
      });
    };

    const createModalWrapper = (): HTMLDivElement => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('li-ai-modal-wrapper');
      return wrapper;
    };

    const createModalContent = (): HTMLDivElement => {
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
      return modal;
    };

    const showModal = (wrapper: HTMLDivElement, modal: HTMLDivElement) => {
      setTimeout(() => {
        wrapper.style.opacity = '1';
        modal.style.transform = 'scale(1)';
      }, 10);
    };

    const handleGenerate = (modal: HTMLDivElement, generateButton: HTMLButtonElement) => {
      const inputElement = modal.querySelector('.li-ai-input') as HTMLInputElement;
      const modalList = modal.querySelector('.li-ai-modal-list') as HTMLUListElement;

      if (inputElement.value.trim()) {
        appendMessageToModal(modalList, inputElement.value);
        setTimeout(() => appendAIResponse(modalList, generateButton), 1000); // mimic AI response
        inputElement.value = ''; // reset input
      }
    };

    const appendMessageToModal = (listElement: HTMLUListElement, message: string) => {
      const userItem = document.createElement('li');
      userItem.classList.add('li-ai-modal-item');
      userItem.textContent = message;
      listElement.appendChild(userItem);
    };

    const appendAIResponse = (modalList: HTMLUListElement, generateButton: HTMLButtonElement) => {
      const aiResponseItem = document.createElement('li');
      aiResponseItem.classList.add('li-ai-modal-item', 'ai-reply');
      aiResponseItem.textContent = 'Thank you for the opportunity! If you have any more questions, feel free to ask.';
      modalList.appendChild(aiResponseItem);

      updateGenerateButton(generateButton);
      displayInsertButton(generateButton.parentElement!);
    };

    const updateGenerateButton = (button: HTMLButtonElement) => {
      button.innerHTML = `<img src="${ResetSvg}" alt="Regenerate Button" /> <span>Regenerate</span>`;
    };

    const displayInsertButton = (parentElement: HTMLElement) => {
      // check if insert button already exists
      if (parentElement.querySelector('.insert-btn')) return;

      const insertButton = createButton(ArrowDownSvg, 'Insert', 'insert-btn li-ai-button');
      insertButton.innerHTML = `<img src="${ArrowDownSvg}" /> <span>Insert</span>`;
      insertButton.addEventListener('click', insertAiResponse);
      parentElement.prepend(insertButton);
    };

    const insertAiResponse = () => {
      if (activeInput) {
        activeInput.focus();
        activeInput.innerHTML = `<p>Thank you for the opportunity! If you have more questions, feel free to ask.</p>`;
        activeInput.parentElement!.querySelector('.msg-form__placeholder')?.classList.remove('msg-form__placeholder');
        activeInput = null;

        closeModal();
      }
    };

    const closeModal = () => {
      document.querySelector('.li-ai-modal-wrapper')?.remove();
    };

    // Using MutationObserver is a more efficient way to detect DOM changes
    setInterval(() => checkForMessageInputs(), 1000);
  },
});
