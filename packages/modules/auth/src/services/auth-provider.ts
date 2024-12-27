import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityProviderService,
  AuthTypes,
  Logger,
} from "@medusajs/framework/types"
import { AuthProviderRegistrationPrefix } from "@types"

type InjectedDependencies = {
  [
    key: `${typeof AuthProviderRegistrationPrefix}${string}`
  ]: AuthTypes.IAuthProvider
  logger?: Logger
}

export default class AuthProviderService {
  protected dependencies: InjectedDependencies
  #logger: Logger

  constructor(container: InjectedDependencies) {
    this.dependencies = container
    this.#logger = container["logger"]
      ? container.logger
      : (console as unknown as Logger)
  }

  protected retrieveProviderRegistration(
    providerId: string
  ): AuthTypes.IAuthProvider {
    try {
      return this.dependencies[`${AuthProviderRegistrationPrefix}${providerId}`]
    } catch (err) {
      const errMessage = `
      Unable to retrieve the auth provider with id: ${providerId}
      Please make sure that the provider is registered in the container and it is configured correctly in your project configuration file.
      `
      this.#logger.error(errMessage)
      throw new Error(errMessage)
    }
  }

  async authenticate(
    provider: string,
    auth: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const providerHandler = this.retrieveProviderRegistration(provider)
    return await providerHandler.authenticate(auth, authIdentityProviderService)
  }

  async register(
    provider: string,
    auth: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const providerHandler = this.retrieveProviderRegistration(provider)
    return await providerHandler.register(auth, authIdentityProviderService)
  }

  async update(
    provider: string,
    data: Record<string, unknown>,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const providerHandler = this.retrieveProviderRegistration(provider)
    return await providerHandler.update(data, authIdentityProviderService)
  }

  async validateCallback(
    provider: string,
    auth: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const providerHandler = this.retrieveProviderRegistration(provider)
    return await providerHandler.validateCallback(
      auth,
      authIdentityProviderService
    )
  }
}
