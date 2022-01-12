import { Injectable } from '@angular/core';
import { PinDialogComponent } from '@app/pin-dialog/pin-dialog.component';
import { State } from '@app/store';
import { sessionLocked } from '@app/store/actions';
import { BrowserVault, DeviceSecurityType, Vault, VaultType } from '@ionic-enterprise/identity-vault';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { VaultFactoryService } from './vault-factory.service';

export type UnlockMode = 'Device' | 'SessionPIN' | 'NeverLock' | 'ForceLogin';

@Injectable({
  providedIn: 'root',
})
export class SessionVaultService {
  vault: Vault | BrowserVault;

  constructor(private modalController: ModalController, store: Store<State>, vaultFactory: VaultFactoryService) {
    this.vault = vaultFactory.create({
      key: 'com.kensodemann.teataster',
      type: VaultType.SecureStorage,
      lockAfterBackgrounded: 5000,
      shouldClearVaultAfterTooManyFailedAttempts: true,
      customPasscodeInvalidUnlockAttempts: 2,
      unlockVaultOnLoad: false,
    });

    this.vault.onLock(() => store.dispatch(sessionLocked()));

    this.vault.onPasscodeRequested(async (isPasscodeSetRequest: boolean) =>
      this.onPasscodeRequest(isPasscodeSetRequest)
    );
  }
  async updateTimeout(value: number | null = 1000) {
    console.log('VaultService.updateTimeout', value);
    const currentConfig = this.vault.config;
    currentConfig.lockAfterBackgrounded = value;
    await this.vault.updateConfig(currentConfig);
    console.log('VaultService.updateTimeout', 'updated');
  }

  async canUnlock(): Promise<boolean> {
    if ((await this.vault.doesVaultExist()) && (await this.vault.isLocked())) {
      return true;
    }
    return false;
  }

  async clearSession(): Promise<void> {
    return this.vault.clear();
  }

  isLocked(): Promise<boolean> {
    return this.vault.isLocked();
  }

  unlock(): Promise<void> {
    return this.vault.unlock();
  }

  setUnlockMode(unlockMode: UnlockMode): Promise<void> {
    let type: VaultType;
    let deviceSecurityType: DeviceSecurityType;

    switch (unlockMode) {
      case 'Device':
        type = VaultType.DeviceSecurity;
        deviceSecurityType = DeviceSecurityType.Both;
        break;

      case 'SessionPIN':
        type = VaultType.CustomPasscode;
        deviceSecurityType = DeviceSecurityType.SystemPasscode;
        break;

      case 'ForceLogin':
        type = VaultType.InMemory;
        deviceSecurityType = DeviceSecurityType.SystemPasscode;
        break;

      case 'NeverLock':
        type = VaultType.SecureStorage;
        deviceSecurityType = DeviceSecurityType.SystemPasscode;
        break;

      default:
        type = VaultType.SecureStorage;
        deviceSecurityType = DeviceSecurityType.SystemPasscode;
    }

    return this.vault.updateConfig({
      ...this.vault.config,
      type,
      deviceSecurityType,
    });
  }

  private async onPasscodeRequest(isPasscodeSetRequest: boolean): Promise<void> {
    const dlg = await this.modalController.create({
      backdropDismiss: false,
      component: PinDialogComponent,
      componentProps: {
        setPasscodeMode: isPasscodeSetRequest,
      },
    });
    dlg.present();
    const { data } = await dlg.onDidDismiss();
    this.vault.setCustomPasscode(data || '');
  }
}
