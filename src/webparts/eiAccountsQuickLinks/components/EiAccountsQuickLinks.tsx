import * as React from 'react';
import styles from './EiAccountsQuickLinks.module.scss';
import type { IEiAccountsQuickLinksProps } from './IEiAccountsQuickLinksProps';
import { Link, Text, FocusTrapZone, Layer, Overlay, Popup, mergeStyleSets, DefaultButton, Stack, TextField, IStackProps, FontIcon, ITextFieldStyles, IButtonStyles } from '@fluentui/react';
import '../../common.css';
import EiAccountService from '../../../services/EiAccountService';
import { IQuickLinks } from '../../../model/IQuickLinks';


export interface IQuickLinksState {
  quicklinks: IQuickLinks[];
  updateQuickLinks: IQuickLinks;
  nameInput: string;
  urlInput: string;
  showPopup: boolean;
  isTouched: boolean;
  hideAddQuickLink: boolean;
}

export default class EiAccountsQuickLinks extends React.Component<IEiAccountsQuickLinksProps, IQuickLinksState> {
  private eiAccountService: EiAccountService;
  setblankfields: any;

  constructor(props: IEiAccountsQuickLinksProps) {
    super(props);

    this.state = {
      showPopup: false,
      isTouched: false,
      quicklinks: [],
      nameInput: '',
      urlInput: '',
      updateQuickLinks: {
        ID: 0,
        Name: '',
        URL: '',
      },
      hideAddQuickLink: true
    };
    this.eiAccountService = new EiAccountService();

    // Bind the method to maintain correct context
    // this.handleQuickLinksTextFieldChange = this.handleQuickLinksTextFieldChange.bind(this);
  }

  public async componentDidMount(): Promise<void> {
    console.log('componentDidMount');
    await (this.getQuickLinks as () => Promise<void>)(); // Using type assertion to indicate no arguments
  }


  public async getQuickLinks(): Promise<void> {
    try {
      const quicklinks: IQuickLinks[] = await this.eiAccountService.getQuickLinks(); // Update this line with your SharePoint API call
      console.log('quicklinks', quicklinks);
      this.setState({ quicklinks });

      if (this.state.quicklinks.length == 5) {
        this.setState({ hideAddQuickLink: false });
      }
      if (this.state.quicklinks.length == 4) {
        this.setState({ hideAddQuickLink: true });
      }
      
    } catch (error) {
      console.error('Error fetching quicklinks:', error);
    }
  }

  navigateToPreviousPage = () => {
    const currentUrl = window.location.href;
    const sourceParam = '?source=' + encodeURIComponent(currentUrl);
    window.location.href =
      'https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Account_Dashboard.aspx?menu=Account%20Dashboard' +
      sourceParam;
  };

  // handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  //   this.setState({ nameInput: event.target.value });
  // }

  // Event handler for updating state when a TextField value changes
  handleQuickLinksTextFieldChange = (fieldName: any, value: any, key: any) => {
    this.setState({
      updateQuickLinks: {
        ...this.state.updateQuickLinks,
        [fieldName]: value

      }
    });
    console.log(this.state.updateQuickLinks);
  };


  private async updateData() {
    try {
      if (!this.state.updateQuickLinks.Name || !this.state.updateQuickLinks.URL) {
        this.setState({ isTouched: true });
        return;
      }
      await this.eiAccountService.saveOrUpdateQuickLinks(this.state.updateQuickLinks);
      await this.getQuickLinks(); // Assuming getQuickLinks does not need to be cast to Promise<void>
      alert('QuickLinks added successfully.');
      // Close the popup after saving the data
      this.setState({ showPopup: false, isTouched: false });
    } catch (error) {
      console.error('Error saving or updating QuickLinks:', error);
    }
  }

  private async handleDeleteQuickLink(quicklinkId: number): Promise<void> {
    try {
      const success: boolean = await this.eiAccountService.deleteQuickLinks(quicklinkId);
      if (success) {
        // Update state after successful deletion
        await this.getQuickLinks();
        alert('QuickLink deleted successfully.');
      } else {
        alert('Failed to delete QuickLink.');
      }
    } catch (error) {
      console.error('Error deleting QuickLink:', error);
      alert('An error occurred while deleting QuickLink.');
    }
  }


  render(): React.ReactElement<IEiAccountsQuickLinksProps> {
    const { quicklinks, showPopup } = this.state;

    const CardListing = quicklinks.map(item => ({
      name: item.Name,
      url: item.URL,
      id: item.ID,
    }));

    const popupStyles = mergeStyleSets({
      root: {
        background: 'rgba(0, 0, 0, 0.2)',
        bottom: '0',
        left: '0',
        position: 'fixed',
        right: '0',
        top: '0',
      },
      content: {
        background: 'white',
        left: '50%',
        maxWidth: '400px',
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: 2,
      },
    });

    const columnProps: Partial<IStackProps> = {
      tokens: { childrenGap: 15 },
      styles: { root: { width: 300 } },
    };

    const textFieldProps: Partial<ITextFieldStyles> = {
      wrapper: { fontFamily: 'Poppins' },
      fieldGroup: { height: 40, border: '1px solid #D7DADE', color: '#D7DADE' },
    };

    const modalButton: Partial<IButtonStyles> = {
      root: { margin: '20px 0', float: 'right' }
    }



    return (
      <section className='quickLinks' >
        <div className='titleWrap'>
          <Text className='tableTitle'>Quick Links</Text>
        </div>
        <div className={`quickLinks_row ${styles.cardWrapper}`}>
          {CardListing.map((item, index) => (
            <div className='quickLinks_col' key={index}>
              <div className={styles.quickLinkCardWrap}>
                <Link className={styles.quickLinkCard} href={item.url}>
                  <Text className={styles.quickLinkText}>{item.name}</Text>
                </Link>
                <Link>
                  <FontIcon aria-label="delete" iconName="delete" className={styles.deleteIcon} onClick={() => this.handleDeleteQuickLink(item.id)} />
                </Link>
              </div>
            </div>
          ))}

          {this.state.hideAddQuickLink && (
            <div className='quickLinks_col'>
              <Link className={styles.addQuickLink} onClick={() => this.setState({ showPopup: true })}>
                <Text className={styles.quickLinkText}>+ Add Quick Link</Text>
              </Link>
            </div>
          )}

          {showPopup && (
            <Layer>
              <Popup
                className={popupStyles.root}
                role="dialog"
                aria-modal="true"
                onDismiss={() => this.setState({ showPopup: false })}
              >
                <Overlay onClick={() => this.setState({ showPopup: false })} />
                <FocusTrapZone>
                  <div role="document" className={popupStyles.content}>
                    <Stack horizontal horizontalAlign='space-between' verticalAlign='center' className={styles.modalPopupHeader}>
                      <Text className={styles.modalPopupTitle}>Add Quick Links</Text>
                      <FontIcon aria-label="Compass" iconName="Cancel" className={styles.iconStyle} onClick={() => this.setState({ showPopup: false })} />
                    </Stack>
                    <div className={styles.modalContent}>
                      <Stack {...columnProps}>

                        <TextField label="Name" styles={textFieldProps} placeholder="Enter Name" className='mt-0' onChange={(event, value) => this.handleQuickLinksTextFieldChange('Name', value, null)}
                          errorMessage={this.state.isTouched && !this.state.updateQuickLinks.Name ? 'Name is required.' : ''}
                          required />
                        <TextField label="URL" styles={textFieldProps} placeholder="Enter URL" className='mt-0' onChange={(event, value) => this.handleQuickLinksTextFieldChange('URL', value, null)}
                          errorMessage={this.state.isTouched && !this.state.updateQuickLinks.URL ? 'URL is required.' : ''}
                          required />
                      </Stack>
                      <DefaultButton className='btn-primary' text="Save" styles={modalButton} onClick={() => this.updateData()}>
                      </DefaultButton>
                    </div>
                  </div>
                </FocusTrapZone>
              </Popup>
            </Layer>
          )}
        </div>
      </section>
    );
  }
}
